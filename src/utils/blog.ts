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

/** Preserve the established 200-wpm article estimate and explicit editorial overrides. */
export function getReadingMetadata(post: Pick<BlogPost, 'body' | 'data'>) {
  const wordCount = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, '')   // remove code blocks
    .replace(/`[^`]*`/g, '')          // remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')  // remove images
    .replace(/\[.*?\]\(.*?\)/g, '$1') // remove link syntax
    .replace(/<[^>]+>/g, '')          // remove HTML tags
    .replace(/[#*_~>\-|]/g, '')       // remove markdown symbols
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
  const readingTime = post.data.readingTime ?? Math.max(1, Math.ceil(wordCount / 200));
  return { wordCount, readingTime };
}
