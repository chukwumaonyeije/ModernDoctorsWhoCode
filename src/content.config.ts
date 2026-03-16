import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
    readingTime: z.number().optional(),
    canonical: z.string().optional(),
  }),
});

export const collections = { blog };
