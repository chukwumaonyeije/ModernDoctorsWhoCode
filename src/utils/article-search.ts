export interface SearchableArticle {
  title: string;
  description: string;
  category: string;
  keywords: string[];
  text?: string;
}

/** Normalize punctuation and accents so queries need not copy the author's typography. */
export function normalizeSearch(value: string): string {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

/** Require every query word, prioritizing title and metadata over body matches. */
export function articleSearchScore(article: SearchableArticle, query: string): number {
  const normalized = normalizeSearch(query);
  if (!normalized) return 1;
  const title = normalizeSearch(article.title);
  const metadata = normalizeSearch([article.description, article.category, ...article.keywords].join(' '));
  const body = normalizeSearch(article.text ?? '');
  let score = title.includes(normalized) ? 30 : 0;
  for (const term of new Set(normalized.split(' '))) {
    if (title.includes(term)) score += 10;
    else if (metadata.includes(term)) score += 4;
    else if (body.includes(term)) score += 1;
    else return 0;
  }
  return score;
}

/** Index readable article text without MDX imports, comments, or component attributes. */
export function articleSearchText(body: string): string {
  return body.replace(/^import\s+.*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}|<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ').trim();
}
