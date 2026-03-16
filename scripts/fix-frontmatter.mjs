/**
 * Fixes WordPress-exported frontmatter to match our Astro content schema.
 *
 * Changes made to each post:
 * - Renames `date` → `pubDate`
 * - Collapses `categories` array → single `category` string (first value, Title Cased)
 * - Cleans invisible Unicode characters from tag values (e.g. U+2060)
 * - Adds `author`, `draft: false` defaults if missing
 * - Removes internal WordPress meta blocks (Meta Description, Primary Keywords lines)
 */

import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.resolve('src/content/blog/posts');
const DRAFTS_DIR = path.resolve('src/content/blog/posts/_drafts');

// Map WordPress category slugs to display names
const CATEGORY_MAP = {
  'technology':    'Technology',
  'blogging':      'Blogging',
  'ai':            'AI',
  'medicine':      'Medicine',
  'mfm':           'MFM',
  'uncategorized': 'Technology',
};

function toTitleCase(str) {
  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function resolveCategory(categories) {
  if (!categories || categories.length === 0) return 'Technology';
  const first = categories[0].trim().toLowerCase();
  return CATEGORY_MAP[first] ?? toTitleCase(first);
}

function cleanValue(val) {
  // Remove invisible Unicode characters (U+2060, U+FEFF, etc.)
  return val.replace(/[\u2060\uFEFF\u200B\u00AD]/g, '').trim();
}

function extractDescription(body) {
  // Find the first non-empty paragraph that isn't a heading, HR, or meta block
  const lines = body.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.length > 40 &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('*') &&
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('!') &&
      !trimmed.startsWith('|') &&
      !trimmed.startsWith('`') &&
      !trimmed.startsWith('**Meta') &&
      !trimmed.startsWith('**Primary') &&
      !trimmed.startsWith('**Secondary')
    ) {
      // Strip markdown formatting and truncate to 155 chars
      const plain = trimmed
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
        .replace(/[*_`#]/g, '')                   // bold/italic/code/headings
        .trim();
      return plain.length > 155 ? plain.slice(0, 152) + '...' : plain;
    }
  }
  return '';
}

function fixFrontmatter(content, isDraft) {
  // Split on the frontmatter delimiters
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return content;

  let fm = match[1];
  let body = match[2];

  // --- date → pubDate ---
  fm = fm.replace(/^date:\s*(.+)$/m, (_, val) => `pubDate: ${val.trim()}`);

  // --- categories array → single category string ---
  const catMatch = fm.match(/^categories:\s*\n((?:  - .+\n?)+)/m);
  if (catMatch) {
    const cats = catMatch[1]
      .split('\n')
      .filter(l => l.trim().startsWith('- '))
      .map(l => l.replace(/^\s*-\s*"?/, '').replace(/"?\s*$/, '').trim());
    const resolved = resolveCategory(cats);
    fm = fm.replace(/^categories:\s*\n((?:  - .+\n?)+)/m, `category: "${resolved}"\n`);
  } else if (!fm.includes('category:')) {
    fm += '\ncategory: "Technology"';
  }

  // --- Clean invisible chars from tag values ---
  fm = fm.replace(/^(  - .+)$/mg, (line) => cleanValue(line));

  // --- Always rewrite description to ensure it's clean YAML ---
  const raw = extractDescription(body);
  const desc = (raw || 'Physician-developer insights from Dr. Chukwuma Onyeije, MD, FACOG.')
    .replace(/\\\[.*?\\\]/g, '')  // remove escaped footnote refs like \[^1\]
    .replace(/\[.*?\]/g, '')      // remove markdown link brackets
    .replace(/\\/g, '')           // remove remaining backslashes
    .replace(/"/g, "'")           // replace double quotes with single quotes
    .replace(/[\r\n]/g, ' ')      // no newlines
    .replace(/[^\x20-\x7E]/g, '') // strip non-ASCII / control chars
    .replace(/\s+/g, ' ')         // collapse whitespace
    .trim();
  // Remove any existing description line and replace it
  fm = fm.replace(/^description:.*$/m, '');
  fm += `\ndescription: "${desc}"`;


  // --- Add author if missing ---
  if (!fm.includes('author:')) {
    fm += '\nauthor: "Chukwuma Onyeije, MD, FACOG"';
  }

  // --- Add draft flag ---
  if (!fm.includes('draft:')) {
    fm += `\ndraft: ${isDraft ? 'true' : 'false'}`;
  }

  // --- Remove WordPress meta blocks from body ---
  // Strips lines like: **Meta Description** ..., **Primary Keywords**: ..., **Secondary Keywords**: ...
  body = body.replace(/^\*\*(Meta Description|Primary Keywords|Secondary Keywords|Target Keywords)[^\n]*\n?/gm, '');

  // Remove separator lines left over after stripping meta blocks
  body = body.replace(/^\* \* \*\n/gm, '');

  return `---\n${fm.trim()}\n---\n${body}`;
}

function processDir(dir, isDraft) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let count = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    const original = fs.readFileSync(filePath, 'utf8');
    const fixed = fixFrontmatter(original, isDraft);
    if (fixed !== original) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      count++;
    }
  }
  return count;
}

const postsFixed = processDir(POSTS_DIR, false);
const draftsFixed = fs.existsSync(DRAFTS_DIR) ? processDir(DRAFTS_DIR, true) : 0;

console.log(`Done. Fixed ${postsFixed} published posts, ${draftsFixed} drafts.`);
