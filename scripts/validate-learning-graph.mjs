import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { load } from 'js-yaml';
import { slug } from 'github-slugger';

const root = process.cwd();
const contentRoot = path.resolve(root, 'src', 'content');
const errors = [];

async function readCollection(name) {
  const directory = path.join(contentRoot, name);
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && ['.md', '.mdx'].includes(path.extname(entry.name)))
    .sort((a, b) => a.name.localeCompare(b.name));
  const entries = new Map();

  for (const file of files) {
    const id = path.basename(file.name, path.extname(file.name));
    const source = await readFile(path.join(directory, file.name), 'utf8');
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

    if (!match) {
      errors.push(`${name}/${file.name}: missing YAML frontmatter`);
      continue;
    }

    try {
      const data = load(match[1]) ?? {};
      const entryId = data.slug ?? slug(id);
      if (entries.has(entryId)) errors.push(`${name}/${file.name}: duplicate ID "${entryId}"`);
      entries.set(entryId, data);
    } catch (error) {
      errors.push(`${name}/${file.name}: invalid YAML (${error.message})`);
    }
  }

  return entries;
}

function assertReference(owner, field, value, targets) {
  if (!value || !targets.has(value)) {
    errors.push(`${owner}: ${field} references missing entry "${value ?? ''}"`);
  }
}

function assertReferences(owner, field, values, targets) {
  for (const value of values ?? []) assertReference(owner, field, value, targets);
}

function assertUniqueOrder(entries, groupBy, label) {
  const groups = new Map();

  for (const [id, data] of entries) {
    const group = groupBy(data);
    const key = `${group}:${data.order}`;
    if (groups.has(key)) {
      errors.push(`${label}: ${id} and ${groups.get(key)} both use order ${data.order} in ${group}`);
    } else {
      groups.set(key, id);
    }
  }
}

const [blog, paths, courses, lessons, projects, channels] = await Promise.all([
  readCollection('blog/posts'),
  readCollection('paths'),
  readCollection('courses'),
  readCollection('lessons'),
  readCollection('projects'),
  readCollection('channels'),
]);

assertUniqueOrder(paths, () => 'paths', 'paths');
assertUniqueOrder(courses, (course) => course.path, 'courses');
assertUniqueOrder(channels, () => 'channels', 'channels');

for (const [id, project] of projects) {
  assertReferences(`projects/${id}`, 'paths', project.paths, paths);
}

for (const [id, course] of courses) {
  assertReference(`courses/${id}`, 'path', course.path, paths);
  if (course.project) assertReference(`courses/${id}`, 'project', course.project, projects);
}

const lessonsByCourse = new Map();
const assignedArticles = new Map();

for (const [id, lesson] of lessons) {
  const owner = `lessons/${id}`;
  assertReference(owner, 'article', lesson.article, blog);
  assertReference(owner, 'course', lesson.course, courses);
  if (lesson.path) assertReference(owner, 'path', lesson.path, paths);
  if (lesson.relatedProject) assertReference(owner, 'relatedProject', lesson.relatedProject, projects);

  const course = courses.get(lesson.course);
  if (course && lesson.path && course.path !== lesson.path) {
    errors.push(`${owner}: path "${lesson.path}" does not match course path "${course.path}"`);
  }

  if (assignedArticles.has(lesson.article)) {
    errors.push(`${owner}: article "${lesson.article}" is already assigned to ${assignedArticles.get(lesson.article)}`);
  } else {
    assignedArticles.set(lesson.article, owner);
  }

  const courseLessons = lessonsByCourse.get(lesson.course) ?? [];
  courseLessons.push({ id, ...lesson });
  lessonsByCourse.set(lesson.course, courseLessons);
}

for (const [courseId, course] of courses) {
  const courseLessons = (lessonsByCourse.get(courseId) ?? [])
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  if (courseLessons.length === 0) {
    if (course.status === 'published') errors.push(`courses/${courseId}: course has no lessons`);
    continue;
  }

  const numbers = new Set();
  for (const lesson of courseLessons) {
    if (!Number.isInteger(lesson.lessonNumber) || lesson.lessonNumber < 1 || numbers.has(lesson.lessonNumber)) errors.push(`lessons/${lesson.id}: invalid or duplicate lessonNumber ${lesson.lessonNumber}`);
    numbers.add(lesson.lessonNumber);
  }

}

for (const [pathId, entry] of paths) {
  if (entry.status === 'published' && ![...courses.values()].some((course) => course.path === pathId)) {
    errors.push(`paths/${pathId}: path has no course`);
  }
}

for (const [id, channel] of channels) {
  const owner = `channels/${id}`;
  assertReferences(owner, 'featuredArticles', channel.featuredArticles, blog);
  assertReferences(owner, 'featuredCourses', channel.featuredCourses, courses);
  assertReferences(owner, 'featuredProjects', channel.featuredProjects, projects);
}

/** Public records cannot advertise unpublished dependencies. */
function assertPublic(owner, field, id, targets, article = false) {
  const target = targets.get(id);
  if (target && (article ? target.draft === true : target.status !== 'published')) {
    errors.push(`${owner}: ${field} references unpublished entry "${id}"`);
  }
}

/** Draft planning records do not count toward the public sequence. */
function assertPublicSequence(entries, field, owner) {
  entries.sort((a, b) => a[1][field] - b[1][field]);
  entries.forEach(([id, data], index) => {
    if (data[field] !== index + 1) errors.push(`${owner}/${id}: public ${field} must be ${index + 1}`);
  });
}

for (const [id, course] of courses) {
  if (course.status !== 'published') continue;
  assertPublic(`courses/${id}`, 'path', course.path, paths);
  const publicLessons = [...lessons].filter(([, lesson]) => lesson.course === id && lesson.status === 'published');
  if (!publicLessons.length) errors.push(`courses/${id}: published course has no published lessons`);
  assertPublicSequence(publicLessons, 'lessonNumber', 'lessons');
  if (course.project && !projects.get(course.project)?.paths?.includes(course.path)) errors.push(`courses/${id}: project does not include course path`);
}
for (const [id, lesson] of lessons) {
  if (!Number.isInteger(lesson.estimatedMinutes) || lesson.estimatedMinutes <= 0) errors.push(`lessons/${id}: estimatedMinutes must be a positive integer`);
  if (lesson.status !== 'published') continue;
  assertPublic(`lessons/${id}`, 'course', lesson.course, courses);
  assertPublic(`lessons/${id}`, 'article', lesson.article, blog, true);
  const course = courses.get(lesson.course);
  if (course) assertPublic(`lessons/${id}`, 'course path', course.path, paths);
  if (lesson.relatedProject && course && !projects.get(lesson.relatedProject)?.paths?.includes(course.path)) errors.push(`lessons/${id}: relatedProject does not include course path`);
}
for (const [id, entry] of paths) {
  if (entry.status !== 'published') continue;
  const publicCourses = [...courses].filter(([, course]) => course.path === id && course.status === 'published');
  if (!publicCourses.length) errors.push(`paths/${id}: published path has no published courses`);
  assertPublicSequence(publicCourses, 'order', 'courses');
}
assertPublicSequence([...paths].filter(([, entry]) => entry.status === 'published'), 'order', 'paths');
for (const [id, channel] of channels) {
  if (channel.status !== 'published') continue;
  for (const article of channel.featuredArticles ?? []) assertPublic(`channels/${id}`, 'featuredArticles', article, blog, true);
  for (const course of channel.featuredCourses ?? []) assertPublic(`channels/${id}`, 'featuredCourses', course, courses);
}

if (errors.length > 0) {
  console.error(`Learning graph validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(
  `Learning graph passed: ${paths.size} paths, ${courses.size} courses, ${lessons.size} lessons, ${projects.size} projects, and ${channels.size} channels.`,
);
