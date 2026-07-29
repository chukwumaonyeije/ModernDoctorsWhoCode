import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/blog/', import.meta.url));

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? findHtmlFiles(path) : (entry.name.endsWith('.html') ? [path] : []);
  }));
  return nested.flat();
}

const files = await findHtmlFiles(root);
const failures = [];
let articleCount = 0;
let tocCount = 0;
let audioCount = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('id="article-title"')) continue;

  articleCount += 1;
  const route = relative(root, file).replaceAll('\\', '/');
  const requireMarkup = (condition, message) => {
    if (!condition) failures.push(`${route}: ${message}`);
  };

  requireMarkup(/<article\b[^>]*aria-labelledby="article-title"/.test(html), 'article is not named by its title');
  requireMarkup(/<h1\b[^>]*id="article-title"/.test(html), 'article title is not the page h1');
  requireMarkup(/<a\b[^>]*href="#main-content"[^>]*class="skip-link"/.test(html), 'skip link is missing');
  requireMarkup(/<main\b[^>]*id="main-content"[^>]*tabindex="-1"/.test(html), 'focusable main landmark is missing');
  requireMarkup(html.includes('aria-labelledby="share-heading"'), 'share controls are not a named section');
  requireMarkup(html.includes('id="copy-link-status" class="sr-only" aria-live="polite"'), 'copy-link status is not announced');
  requireMarkup(!html.includes('fonts.googleapis.com/css2?family=Syne'), 'shared remote font stylesheet remains');

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  requireMarkup(duplicateIds.length === 0, `duplicate IDs: ${duplicateIds.join(', ')}`);

  if (html.includes('article-toc--desktop')) {
    tocCount += 1;
    requireMarkup(html.includes('article-toc--mobile'), 'desktop TOC has no in-flow mobile equivalent');
    requireMarkup(/<details\b[^>]*class="article-toc article-toc--mobile"/.test(html), 'mobile TOC is not a native disclosure');
    requireMarkup(html.includes('aria-label="Article sections"'), 'TOC navigation has no accessible name');
  }

  if (html.includes('id="dwc-audio"')) {
    audioCount += 1;
    requireMarkup(html.includes('aria-pressed="false" class="audio-play-button"'), 'audio play state is not exposed');
    requireMarkup(html.includes('id="audio-progress-bar" type="range"'), 'audio seek control is not keyboard operable');
    requireMarkup(html.includes('aria-label="Seek article audio"'), 'audio seek control has no accessible name');
  }
}

if (articleCount < 150) {
  failures.push(`Expected at least 150 shared-layout articles, found ${articleCount}`);
}

if (tocCount === 0) failures.push('No article table of contents was found');
if (audioCount === 0) failures.push('No article audio player was found');

if (failures.length > 0) {
  console.error('Article experience validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Article experience passed: ${articleCount} shared-layout articles, ${tocCount} with tables of contents, and ${audioCount} with audio.`);
