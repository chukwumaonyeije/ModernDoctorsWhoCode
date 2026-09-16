import { getCollection } from 'astro:content';
import { classifyArticleFormat, classifyArticleTopics, normalizeCategory } from '../data/taxonomy';
import { sortBlogPosts } from './blog';
import { getCurriculum } from './learning';

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
  const [posts, graph] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCurriculum(),
  ]);

  return sortBlogPosts(posts).map((post) => {
    const context = graph.articleContext(post.id);
    const lesson = context?.lesson;
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
      path: context?.path.id,
      course: lesson?.data.course.id,
      difficulty: lesson?.data.difficulty,
      published: post.data.pubDate.toISOString(),
      year: post.data.pubDate.getUTCFullYear(),
      keywords: [...post.data.tags, post.data.category, ...topics],
    };
  });
}
