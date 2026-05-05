import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export function sortBlogPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const rankDiff = (b.data.featuredRank ?? 0) - (a.data.featuredRank ?? 0);
    if (rankDiff !== 0) {
      return rankDiff;
    }

    return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  });
}
