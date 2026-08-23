import { getCollection } from 'astro:content';
import { classifyArticleFormat, classifyArticleTopics, normalizeCategory } from '../data/taxonomy';
import { sortBlogPosts } from './blog';
import { getCourses, getLearningPaths, getProjects, getPublishedChannels } from './learning';

export interface ArticleSearchRecord {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  topics: string[];
  format: string;
  path?: string;
  course?: string;
  difficulty?: string;
  published: string;
  year: number;
  keywords: string[];
}

export async function buildArticleSearchIndex(): Promise<ArticleSearchRecord[]> {
  const [posts, lessons] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('lessons', ({ data }) => data.status === 'published'),
  ]);
  const lessonByArticle = new Map(lessons.map((lesson) => [lesson.data.article.id, lesson]));

  return sortBlogPosts(posts).map((post) => {
    const lesson = lessonByArticle.get(post.id);
    const input = {
      title: post.data.title,
      description: post.data.description,
      category: post.data.category,
      tags: post.data.tags,
    };
    const topics = classifyArticleTopics(input);

    return {
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      url: `/blog/${post.id}/`,
      category: normalizeCategory(post.data.category),
      topics,
      format: classifyArticleFormat(input),
      path: lesson?.data.path.id,
      course: lesson?.data.course.id,
      difficulty: lesson?.data.difficulty,
      published: post.data.pubDate.toISOString(),
      year: post.data.pubDate.getUTCFullYear(),
      keywords: [...post.data.tags, post.data.category, ...topics],
    };
  });
}

export type GlobalSearchType = 'article' | 'course' | 'path' | 'project' | 'channel';

export interface GlobalSearchRecord {
  type: GlobalSearchType;
  title: string;
  description: string;
  url: string;
  meta?: string;
}

/**
 * Aggregates every browsable content type into one flat, typed index for the
 * global search palette. Kept separate from buildArticleSearchIndex/
 * search-index.json, which the /blog archive filter depends on unchanged.
 */
export async function buildGlobalSearchIndex(): Promise<GlobalSearchRecord[]> {
  const [articles, courses, paths, projects, channels] = await Promise.all([
    buildArticleSearchIndex(),
    getCourses(),
    getLearningPaths(),
    getProjects(),
    getPublishedChannels(),
  ]);

  const articleRecords: GlobalSearchRecord[] = articles.map((article) => ({
    type: 'article',
    title: article.title,
    description: article.description,
    url: article.url,
    meta: article.category,
  }));

  const courseRecords: GlobalSearchRecord[] = courses.map((course) => ({
    type: 'course',
    title: course.data.title,
    description: course.data.description,
    url: `/courses/${course.id}/`,
    meta: `${course.data.difficulty} · ${Math.round(course.data.estimatedMinutes / 60) || 1}h`,
  }));

  const pathRecords: GlobalSearchRecord[] = paths.map((path) => ({
    type: 'path',
    title: path.data.title,
    description: path.data.description,
    url: `/paths/${path.id}/`,
    meta: path.data.audience,
  }));

  const projectRecords: GlobalSearchRecord[] = projects.map((project) => ({
    type: 'project',
    title: project.data.title,
    description: project.data.description,
    url: `/projects/${project.id}/`,
    meta: project.data.difficulty,
  }));

  const channelRecords: GlobalSearchRecord[] = channels.map((channel) => ({
    type: 'channel',
    title: channel.data.title,
    description: channel.data.description,
    url: `/channels/${channel.id}/`,
    meta: channel.data.topics.slice(0, 2).join(', '),
  }));

  return [...pathRecords, ...courseRecords, ...projectRecords, ...channelRecords, ...articleRecords];
}
