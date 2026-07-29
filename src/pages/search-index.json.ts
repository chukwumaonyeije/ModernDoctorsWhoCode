import type { APIRoute } from 'astro';
import { buildArticleSearchIndex } from '../utils/search';

export const prerender = true;

export const GET: APIRoute = async () => {
  const records = await buildArticleSearchIndex();

  return new Response(JSON.stringify(records), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
