export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildTagIndex(tags: string[]): Map<string, { label: string; count: number }> {
  const index = new Map<string, { label: string; count: number }>();

  for (const rawTag of tags) {
    const slug = slugifyTag(rawTag);
    if (!slug) {
      continue;
    }

    const existing = index.get(slug);
    if (existing) {
      existing.count += 1;
      continue;
    }

    index.set(slug, {
      label: rawTag.trim(),
      count: 1,
    });
  }

  return index;
}
