import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { load } from 'js-yaml';

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
      entries.set(id, load(match[1]) ?? {});
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
  assertReference(owner, 'path', lesson.path, paths);
  if (lesson.relatedProject) assertReference(owner, 'relatedProject', lesson.relatedProject, projects);

  const course = courses.get(lesson.course);
  if (course && course.path !== lesson.path) {
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
    errors.push(`courses/${courseId}: course has no lessons`);
    continue;
  }

  courseLessons.forEach((lesson, index) => {
    const expected = index + 1;
    if (lesson.lessonNumber !== expected) {
      errors.push(`lessons/${lesson.id}: expected lessonNumber ${expected}, received ${lesson.lessonNumber}`);
    }
  });

  const totalMinutes = courseLessons.reduce((total, lesson) => total + lesson.estimatedMinutes, 0);
  if (totalMinutes !== course.estimatedMinutes) {
    errors.push(`courses/${courseId}: estimatedMinutes is ${course.estimatedMinutes}, lesson total is ${totalMinutes}`);
  }
}

for (const pathId of paths.keys()) {
  if (![...courses.values()].some((course) => course.path === pathId)) {
    errors.push(`paths/${pathId}: path has no course`);
  }
}

for (const [id, channel] of channels) {
  const owner = `channels/${id}`;
  assertReferences(owner, 'featuredArticles', channel.featuredArticles, blog);
  assertReferences(owner, 'featuredCourses', channel.featuredCourses, courses);
  assertReferences(owner, 'featuredProjects', channel.featuredProjects, projects);
}

if (errors.length > 0) {
  console.error(`Learning graph validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(
  `Learning graph passed: ${paths.size} paths, ${courses.size} courses, ${lessons.size} lessons, ${projects.size} projects, and ${channels.size} channels.`,
);
