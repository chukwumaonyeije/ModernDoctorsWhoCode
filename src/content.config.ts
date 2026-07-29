import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const difficulty = z.enum(['beginner', 'intermediate', 'advanced']);
const publicationStatus = z.enum(['draft', 'published']);

const blog = defineCollection({
  loader: glob({ base: './src/content/blog/posts', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Chukwuma Onyeije, MD, FACOG'),
    authorUrl: z.string().default('https://www.linkedin.com/in/chukwumaonyeije'),
    tags: z.array(z.string()).default([]),
    category: z.string().default('Technology'),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    featuredRank: z.number().default(0),
    readingTime: z.number().optional(),
    canonical: z.string().optional(),
    audioUrl: z.string().optional(),
  }),
});

const paths = defineCollection({
  loader: glob({ base: './src/content/paths', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    audience: z.string(),
    outcome: z.string(),
    order: z.number().int().positive(),
    icon: z.enum(['code', 'ai', 'software']),
    newsletterTrack: z.string(),
    featured: z.boolean().default(true),
    status: publicationStatus.default('draft'),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    difficulty,
    skills: z.array(z.string()).min(1),
    estimatedHours: z.number().positive().optional(),
    paths: z.array(reference('paths')).min(1),
    repositoryUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    featured: z.boolean().default(false),
    status: z.enum(['idea', 'build', 'published']).default('idea'),
  }),
});

const courses = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    path: reference('paths'),
    difficulty,
    outcomes: z.array(z.string()).min(1),
    prerequisites: z.array(z.string()).default([]),
    estimatedMinutes: z.number().int().positive(),
    project: reference('projects').optional(),
    order: z.number().int().positive(),
    status: publicationStatus.default('draft'),
  }),
});

const lessons = defineCollection({
  loader: glob({ base: './src/content/lessons', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    article: reference('blog'),
    course: reference('courses'),
    path: reference('paths'),
    lessonNumber: z.number().int().positive(),
    difficulty,
    estimatedMinutes: z.number().int().positive(),
    prerequisites: z.array(z.string()).default([]),
    learningObjectives: z.array(z.string()).min(1),
    relatedProject: reference('projects').optional(),
    status: publicationStatus.default('draft'),
  }),
});

const channels = defineCollection({
  loader: glob({ base: './src/content/channels', pattern: '*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topics: z.array(z.string()).min(1),
    featuredArticles: z.array(reference('blog')).default([]),
    featuredCourses: z.array(reference('courses')).default([]),
    featuredProjects: z.array(reference('projects')).default([]),
    order: z.number().int().positive(),
    status: publicationStatus.default('draft'),
  }),
});

export const collections = { blog, paths, courses, lessons, projects, channels };
