import { getCollection, getEntry } from 'astro:content';

type PublicationStatus = 'draft' | 'published';
type WithStatus = { data: { status: PublicationStatus } };

interface QueryOptions {
  includeDrafts?: boolean;
}

function isVisible<T extends WithStatus>(entry: T, includeDrafts: boolean) {
  return includeDrafts || entry.data.status === 'published';
}

export async function getLearningPaths(options: QueryOptions = {}) {
  const { includeDrafts = false } = options;
  const paths = await getCollection('paths');

  return paths
    .filter((path) => isVisible(path, includeDrafts))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getCourses(options: QueryOptions = {}) {
  const { includeDrafts = false } = options;
  const courses = await getCollection('courses');

  return courses
    .filter((course) => isVisible(course, includeDrafts))
    .sort((a, b) => a.data.path.id.localeCompare(b.data.path.id) || a.data.order - b.data.order);
}

export async function getCoursesForPath(pathId: string, options: QueryOptions = {}) {
  const { includeDrafts = false } = options;
  const courses = await getCollection('courses');

  return courses
    .filter((course) => course.data.path.id === pathId && isVisible(course, includeDrafts))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getLessonsForCourse(courseId: string, options: QueryOptions = {}) {
  const { includeDrafts = false } = options;
  const lessons = await getCollection('lessons');

  return lessons
    .filter((lesson) => lesson.data.course.id === courseId && isVisible(lesson, includeDrafts))
    .sort((a, b) => a.data.lessonNumber - b.data.lessonNumber);
}

export async function getCourseContext(courseId: string, options: QueryOptions = {}) {
  const course = await getEntry('courses', courseId);
  if (!course || !isVisible(course, options.includeDrafts ?? false)) return undefined;

  const path = await getEntry('paths', course.data.path.id);
  const lessons = await getLessonsForCourse(course.id, options);
  const project = course.data.project
    ? await getEntry('projects', course.data.project.id)
    : undefined;
  const pathCourses = await getCoursesForPath(course.data.path.id, options);
  const courseIndex = pathCourses.findIndex((entry) => entry.id === course.id);

  return {
    course,
    path,
    lessons,
    project,
    previousCourse: courseIndex > 0 ? pathCourses[courseIndex - 1] : undefined,
    nextCourse: courseIndex >= 0 ? pathCourses[courseIndex + 1] : undefined,
  };
}

export async function getLearningContextForArticle(articleId: string, options: QueryOptions = {}) {
  const { includeDrafts = false } = options;
  const lessons = await getCollection('lessons');
  const lesson = lessons.find(
    (entry) => entry.data.article.id === articleId && isVisible(entry, includeDrafts),
  );

  if (!lesson) return undefined;

  const course = await getEntry('courses', lesson.data.course.id);
  const path = await getEntry('paths', lesson.data.path.id);
  const project = lesson.data.relatedProject
    ? await getEntry('projects', lesson.data.relatedProject.id)
    : undefined;
  const courseLessons = await getLessonsForCourse(lesson.data.course.id, options);
  const lessonIndex = courseLessons.findIndex((entry) => entry.id === lesson.id);

  return {
    lesson,
    course,
    path,
    project,
    previousLesson: lessonIndex > 0 ? courseLessons[lessonIndex - 1] : undefined,
    nextLesson: lessonIndex >= 0 ? courseLessons[lessonIndex + 1] : undefined,
    courseLessons,
  };
}

export async function getPublishedChannels() {
  const channels = await getCollection('channels', ({ data }) => data.status === 'published');
  return channels.sort((a, b) => a.data.order - b.data.order);
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.title.localeCompare(b.data.title));
}

export async function getProjectContext(projectId: string, options: QueryOptions = {}) {
  const project = await getEntry('projects', projectId);
  if (!project) return undefined;

  const [paths, courses, lessons] = await Promise.all([
    Promise.all(project.data.paths.map((path) => getEntry('paths', path.id))),
    getCourses(options),
    getCollection('lessons'),
  ]);

  return {
    project,
    paths: paths.filter((path) => path && isVisible(path, options.includeDrafts ?? false)),
    courses: courses.filter((course) => course.data.project?.id === project.id),
    lessons: lessons
      .filter((lesson) => lesson.data.relatedProject?.id === project.id && isVisible(lesson, options.includeDrafts ?? false))
      .sort((a, b) => a.data.lessonNumber - b.data.lessonNumber),
  };
}

export async function getChannelContext(channelId: string) {
  const channel = await getEntry('channels', channelId);
  if (!channel || channel.data.status !== 'published') return undefined;

  const [articles, courses, projects] = await Promise.all([
    Promise.all(channel.data.featuredArticles.map((article) => getEntry('blog', article.id))),
    Promise.all(channel.data.featuredCourses.map((course) => getEntry('courses', course.id))),
    Promise.all(channel.data.featuredProjects.map((project) => getEntry('projects', project.id))),
  ]);

  return {
    channel,
    articles: articles.filter((article) => article && !article.data.draft),
    courses: courses.filter((course) => course && course.data.status === 'published'),
    projects: projects.filter(Boolean),
  };
}
