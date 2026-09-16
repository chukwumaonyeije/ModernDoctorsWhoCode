import { getCollection, getEntry } from "astro:content";
import { createCurriculum, type QueryOptions } from "./curriculum";

/** Load a fresh content snapshot so development edits never encounter a stale module cache. */
export async function getCurriculum(options: QueryOptions = {}) {
  const [paths, courses, lessons, articles, projects] = await Promise.all([
    getCollection("paths"), getCollection("courses"), getCollection("lessons"), getCollection("blog"), getCollection("projects"),
  ]);
  return createCurriculum({ paths, courses, lessons, articles, projects }, options);
}
/** Public paths in editorial order. */
export async function getLearningPaths(options: QueryOptions = {}) { return (await getCurriculum(options)).paths; }
/** Public courses whose parent paths are public. */
export async function getCourses(options: QueryOptions = {}) { return (await getCurriculum(options)).courses; }
/** Course order is owned by the course records. */
export async function getCoursesForPath(id: string, options: QueryOptions = {}) { return (await getCurriculum(options)).coursesForPath(id); }
/** Public lessons must also have public parents and articles. */
export async function getLessonsForCourse(id: string, options: QueryOptions = {}) { return (await getCurriculum(options)).lessonsForCourse(id); }
/** Shared syllabus, duration, neighbors and final destination. */
export async function getCourseContext(id: string, options: QueryOptions = {}) { return (await getCurriculum(options)).courseContext(id); }
/** Shared path counts and duration. */
export async function getPathContext(id: string, options: QueryOptions = {}) { return (await getCurriculum(options)).pathContext(id); }
/** All path cards use the same aggregation. */
export async function getPathSummaries(options: QueryOptions = {}) {
  const graph = await getCurriculum(options);
  return graph.paths.map(path => graph.pathContext(path.id)!);
}
/** All course cards use the same aggregation. */
export async function getCourseSummaries(options: QueryOptions = {}) {
  const graph = await getCurriculum(options);
  return graph.courses.map(course => graph.courseContext(course.id)!);
}
/** Lesson context always derives path ownership from the course. */
export async function getLearningContextForArticle(id: string, options: QueryOptions = {}) { return (await getCurriculum(options)).articleContext(id); }
/** Channels have an independent publication status. */
export async function getPublishedChannels() {
  return (await getCollection("channels", ({ data }) => data.status === "published")).sort((a, b) => a.data.order - b.data.order);
}
/** Project lifecycle is not publication status: idea briefs remain publicly browsable. */
export async function getProjects() {
  return (await getCollection("projects")).sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.title.localeCompare(b.data.title));
}
/** Resolve project prerequisites through the public graph. */
export async function getProjectContext(id: string, options: QueryOptions = {}) {
  const [project, graph] = await Promise.all([getEntry("projects", id), getCurriculum(options)]);
  if (!project) return undefined;
  const courses = graph.courses.filter(course => course.data.project?.id === id);
  return { project, paths: graph.paths.filter(path => project.data.paths.some(ref => ref.id === path.id)), courses,
    courseCards: courses.map(course => graph.courseContext(course.id)!),
    lessons: graph.lessons.filter(lesson => lesson.data.relatedProject?.id === id),
  };
}
/** Curated references cannot bypass parent publication checks. */
export async function getChannelContext(id: string) {
  const channel = await getEntry("channels", id);
  if (!channel || channel.data.status !== "published") return undefined;
  const [articles, graph, projects] = await Promise.all([
    getCollection("blog"), getCurriculum(), getProjects(),
  ]);
  const courses = channel.data.featuredCourses.flatMap(ref => graph.courses.filter(course => course.id === ref.id));
  return { channel, courses, courseCards: courses.map(course => graph.courseContext(course.id)!),
    articles: channel.data.featuredArticles.flatMap(ref => articles.filter(article => article.id === ref.id && !article.data.draft)),
    projects: channel.data.featuredProjects.flatMap(ref => projects.filter(project => project.id === ref.id)),
  };
}
