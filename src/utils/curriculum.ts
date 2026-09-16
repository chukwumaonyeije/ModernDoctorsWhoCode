import type { CollectionEntry } from "astro:content";

export interface CurriculumData {
  paths: CollectionEntry<"paths">[];
  courses: CollectionEntry<"courses">[];
  lessons: CollectionEntry<"lessons">[];
  articles: CollectionEntry<"blog">[];
  projects: CollectionEntry<"projects">[];
}
export interface QueryOptions { includeDrafts?: boolean }

/** Build one publication-closed view. Course ownership determines every lesson path. */
export function createCurriculum(data: CurriculumData, options: QueryOptions = {}) {
  const visible = (entry: { data: { status: string } }) => options.includeDrafts || entry.data.status === "published";
  const paths = data.paths.filter(visible).sort((a, b) => a.data.order - b.data.order);
  const pathById = new Map(paths.map(entry => [entry.id, entry]));
  const courses = data.courses.filter(entry => visible(entry) && pathById.has(entry.data.path.id))
    .sort((a, b) => a.data.path.id.localeCompare(b.data.path.id) || a.data.order - b.data.order);
  const courseById = new Map(courses.map(entry => [entry.id, entry]));
  const articleById = new Map(data.articles.filter(entry => options.includeDrafts || !entry.data.draft).map(entry => [entry.id, entry]));
  const lessons = data.lessons.filter(entry => visible(entry) && courseById.has(entry.data.course.id) && articleById.has(entry.data.article.id))
    .sort((a, b) => courses.findIndex(c => c.id === a.data.course.id) - courses.findIndex(c => c.id === b.data.course.id) || a.data.lessonNumber - b.data.lessonNumber);
  const projectById = new Map(data.projects.map(entry => [entry.id, entry]));
  const coursesForPath = (id: string) => courses.filter(entry => entry.data.path.id === id);
  const lessonsForCourse = (id: string) => lessons.filter(entry => entry.data.course.id === id);
  /** Lesson effort is intentionally distinct from article reading time. */
  function courseContext(id: string) {
    const course = courseById.get(id);
    if (!course) return undefined;
    const path = pathById.get(course.data.path.id)!;
    const sequence = lessonsForCourse(id);
    const siblings = coursesForPath(path.id);
    const index = siblings.findIndex(entry => entry.id === id);
    const project = course.data.project ? projectById.get(course.data.project.id) : undefined;
    return { course, path, lessons: sequence, project, lessonCount: sequence.length,
      estimatedMinutes: sequence.reduce((total, lesson) => total + lesson.data.estimatedMinutes, 0),
      previousCourse: index > 0 ? siblings[index - 1] : undefined, nextCourse: siblings[index + 1],
      terminalAction: project
        ? { href: `/courses/${id}/#course-project`, label: "Build the project" }
        : { href: `/courses/${id}/`, label: "Review the syllabus" },
    };
  }
  /** Aggregate visible course summaries without authored aggregate metadata. */
  function pathContext(id: string) {
    const path = pathById.get(id);
    if (!path) return undefined;
    const courseSections = coursesForPath(id).map(course => courseContext(course.id)!);
    return { path, courses: courseSections.map(section => section.course), courseSections,
      courseCount: courseSections.length,
      lessonCount: courseSections.reduce((total, section) => total + section.lessonCount, 0),
      estimatedMinutes: courseSections.reduce((total, section) => total + section.estimatedMinutes, 0),
    };
  }
  /** Resolve article navigation using the same sequence as the course syllabus. */
  function articleContext(articleId: string) {
    const matches = lessons.filter(entry => entry.data.article.id === articleId);
    if (matches.length > 1) throw new Error(`Article ${articleId} belongs to multiple lessons.`);
    const lesson = matches[0];
    if (!lesson) return undefined;
    const context = courseContext(lesson.data.course.id)!;
    const index = context.lessons.findIndex(entry => entry.id === lesson.id);
    return { ...context, lesson, courseLessons: context.lessons,
      project: lesson.data.relatedProject ? projectById.get(lesson.data.relatedProject.id) : context.project,
      previousLesson: index > 0 ? context.lessons[index - 1] : undefined,
      nextLesson: context.lessons[index + 1],
    };
  }
  return { paths, courses, lessons, coursesForPath, lessonsForCourse, courseContext, pathContext, articleContext };
}
