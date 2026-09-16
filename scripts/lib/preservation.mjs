import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import { slug } from 'github-slugger';
import { load } from 'js-yaml';

export const SITE_ORIGIN = 'https://www.doctorswhocode.blog';
const PLATFORM_ASSETS = new Set(['/_vercel/insights/script.js']);
const TEXT_ASSET = /\.(?:html|txt|svg|xml|json|css|js|md)$/i;
const SPECIAL_SOURCES = [
  'src/pages/blog/docling-rag-tutorial.astro',
  'src/pages/blog/internal-mfm-scoring-optimization-engine.astro',
  'src/content/internal/mfm-scoring-optimization-engine.html',
];

/** Normalize checkout line endings, without hiding prose or punctuation changes. */
export function textHash(text) {
  return createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
}

/** Return stable, POSIX-relative file names; errors remain fatal to the caller. */
export async function listFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(path.join(directory, prefix), { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(directory, relative));
    else if (entry.isFile()) files.push(relative);
  }
  return files.sort();
}

/** Hash binaries without buffering narration files; normalize textual checkout differences. */
async function assetHash(file) {
  if (TEXT_ASSET.test(file)) return textHash(await readFile(file, 'utf8'));
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

/** Convert a static output file to its existing public route. */
export function pageRoute(file) {
  if (file === 'index.html') return '/';
  return `/${file.endsWith('/index.html') ? file.slice(0, -10) : file}`;
}

/** Walk parsed HTML, excluding template payloads and treating scripts as non-content. */
function visit(node, callback) {
  callback(node);
  if (['script', 'style', 'template'].includes(node.tagName)) return;
  for (const child of node.childNodes ?? []) visit(child, callback);
}

/** Extract real DOM attributes, so examples inside code blocks cannot create false links. */
export function inspectHtml(html) {
  const document = parse(html);
  const ids = new Set();
  const references = [];
  const metadata = {};
  const canonicals = [];
  const headings = [];
  const body = [];
  const audio = [];
  const contentMedia = [];
  let title = '';
  let proseNode;
  const contentText = (node, preserveCode = false) => {
    const parts = [];
    const collect = (child) => {
      if (['script', 'style', 'template'].includes(child.tagName)) return;
      if (preserveCode && child.tagName === 'pre') {
        // Highlighting spans are presentation; code whitespace is meaningful.
        const code = [];
        visit(child, (token) => { if (token.nodeName === '#text') code.push(token.value); });
        parts.push(`\u0000code:${textHash(code.join(''))}\u0000`);
        return;
      }
      if (child.nodeName === '#text') parts.push(child.value);
      for (const nested of child.childNodes ?? []) collect(nested);
    };
    collect(node);
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  };
  visit(document, (node) => {
    const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (attrs.id) ids.add(attrs.id);
    if (node.tagName === 'a' && attrs.name) ids.add(attrs.name);
    if (node.tagName === 'title') title = contentText(node);
    if (node.tagName === 'meta') metadata[attrs.property ?? attrs.name] = attrs.content ?? '';
    if (node.tagName === 'link' && attrs.rel?.split(/\s+/).includes('canonical')) canonicals.push(attrs.href);
    if (node.tagName === 'a' && attrs.href) references.push({ kind: 'link', url: attrs.href });
    // Newsletter instance IDs are randomly generated on every build, not durable article anchors.
    if (/^h[1-6]$/.test(node.tagName ?? '') && attrs.id && !/^newsletter-[a-z0-9]+-/.test(attrs.id)) headings.push(attrs.id);
    if (!proseNode && attrs.class?.split(/\s+/).includes('prose')) proseNode = node;
    if (attrs.class?.split(/\s+/).includes('post-feature-image')) contentMedia.push({ tag: node.tagName, src: attrs.src ?? null });
    if (node.tagName === 'audio' && attrs.src) audio.push(attrs.src);
    const mediaAttrs = {
      img: ['src'], audio: ['src'], video: ['src', 'poster'], source: ['src'],
      track: ['src'], iframe: ['src'], object: ['data'], script: ['src'],
    };
    for (const attribute of mediaAttrs[node.tagName] ?? []) {
      if (attrs[attribute]) references.push({ kind: 'asset', url: attrs[attribute] });
    }
    // Local responsive sources cannot contain an unescaped comma in their URL.
    if (['img', 'source'].includes(node.tagName) && attrs.srcset && !attrs.srcset.startsWith('data:')) {
      for (const item of attrs.srcset.split(',')) {
        const url = item.trim().split(/\s+/)[0];
        if (url) references.push({ kind: 'asset', url });
      }
    }
    if (node.tagName === 'link' && /^(?:icon|shortcut icon|stylesheet|preload|alternate|sitemap)$/.test(attrs.rel ?? '') && attrs.href) {
      references.push({ kind: 'asset', url: attrs.href });
    }
    if (node.tagName === 'meta' && ['og:image', 'twitter:image'].includes(attrs.property ?? attrs.name) && attrs.content) {
      references.push({ kind: 'asset', url: attrs.content });
    }
  });
  if (proseNode) {
    body.push(contentText(proseNode, true));
    visit(proseNode, (node) => {
      if (!['img', 'audio', 'video', 'source', 'track', 'iframe', 'object'].includes(node.tagName)) return;
      const media = { tag: node.tagName };
      for (const { name, value } of node.attrs ?? []) {
        if (['src', 'srcset', 'poster', 'data'].includes(name)) media[name] = value;
      }
      contentMedia.push(media);
    });
  }
  return {
    ids, references, canonicals, title, metadata, audio: [...new Set(audio)].sort(),
    headings, contentMedia, bodyTextHash: proseNode ? textHash(body.join(' ')) : null,
  };
}

/** Resolve only files inside the static build, including encoded historical routes. */
export function resolveTarget(pathname, files) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return undefined; }
  const relative = decoded.replace(/^\/+/, '');
  if (relative.split(/[\\/]/).includes('..') || relative.includes('\\')) return undefined;
  const candidates = decoded.endsWith('/')
    ? [`${relative}index.html`]
    : [relative, `${relative}.html`, `${relative}/index.html`];
  return candidates.find((candidate) => files.has(candidate));
}

/** Report exact missing local paths and fragments, without executing third-party requests. */
export function findReferenceIssues(pages, files) {
  const issues = new Set();
  for (const [file, page] of pages) {
    const route = pageRoute(file);
    for (const ref of page.references) {
      let url;
      try { url = new URL(ref.url, `${SITE_ORIGIN}${route}`); } catch {
        issues.add(`invalid-url | ${route} | ${ref.url}`);
        continue;
      }
      if (url.origin !== SITE_ORIGIN || PLATFORM_ASSETS.has(url.pathname)) continue;
      const target = resolveTarget(url.pathname, files);
      if (!target) {
        issues.add(`missing-${ref.kind} | ${route} | ${url.pathname}`);
        continue;
      }
      if (ref.kind !== 'link' || !url.hash || !pages.has(target)) continue;
      let fragment;
      try { fragment = decodeURIComponent(url.hash.slice(1)).split(':~:text=')[0]; } catch {
        issues.add(`invalid-fragment | ${route} | ${url.pathname}${url.hash}`);
        continue;
      }
      if (fragment && fragment !== 'top' && !pages.get(target).ids.has(fragment)) {
        issues.add(`missing-fragment | ${route} | ${url.pathname}#${fragment}`);
      }
    }
  }
  return [...issues].sort();
}

/** Retain source text and authored metadata separately from generated presentation. */
export function inspectArticle(source, filename) {
  const normalized = source.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) throw new Error(`${filename}: missing frontmatter`);
  const data = load(match[1]);
  const id = data.slug ?? slug(filename.replace(/\.(?:md|mdx)$/, ''));
  return { id, data, bodyHash: textHash(normalized.slice(match[0].length)) };
}

/** Read generated RSS/sitemap elements without treating XML link elements as HTML void tags. */
function xmlValues(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'g'))]
    .map((match) => match[1].trim());
}

/** Capture required preservation facts from source plus a freshly generated static build. */
export async function captureSite(root) {
  const dist = path.join(root, 'dist');
  const files = new Set(await listFiles(dist));
  if (!files.has('index.html')) throw new Error('Missing dist/index.html. Run npm run build first.');
  const parsedPages = new Map();
  const pages = {};
  for (const file of [...files].filter((name) => name.endsWith('.html'))) {
    const parsed = inspectHtml(await readFile(path.join(dist, file), 'utf8'));
    parsedPages.set(file, parsed);
    pages[pageRoute(file)] = { canonical: parsed.canonicals };
  }
  const articles = {};
  const articleDir = path.join(root, 'src/content/blog/posts');
  for (const filename of (await readdir(articleDir)).filter((name) => /\.(md|mdx)$/.test(name)).sort()) {
    const { id, data, bodyHash } = inspectArticle(await readFile(path.join(articleDir, filename), 'utf8'), filename);
    if (data.draft) continue;
    const route = `/blog/${id}/`;
    const parsed = parsedPages.get(resolveTarget(route, files));
    if (!parsed) throw new Error(`${filename}: published article output is missing at ${route}`);
    articles[filename] = {
      id, route, bodyHash, frontmatter: JSON.parse(JSON.stringify(data)),
      rendered: {
        title: parsed.title,
        description: parsed.metadata.description ?? null,
        canonical: parsed.canonicals,
        published: parsed.metadata['article:published_time'] ?? null,
        ogImage: parsed.metadata['og:image'] ?? null,
        audio: parsed.audio,
        contentMedia: parsed.contentMedia,
        metadata: Object.fromEntries(Object.entries(parsed.metadata).filter(([key]) =>
          key === 'author' || key === 'description' || key === 'robots' || /^(?:article:|og:|twitter:)/.test(key))),
        headings: parsed.headings,
        bodyTextHash: parsed.bodyTextHash,
      },
    };
  }
  const sourceHashes = {};
  for (const file of SPECIAL_SOURCES) sourceHashes[file] = textHash(await readFile(path.join(root, file), 'utf8'));
  const publicAssets = {};
  for (const file of await listFiles(path.join(root, 'public'))) {
    publicAssets[`/${file}`] = await assetHash(path.join(root, 'public', file));
    if (!files.has(file)) throw new Error(`Public asset missing from build: /${file}`);
    if (await assetHash(path.join(dist, file)) !== publicAssets[`/${file}`]) {
      throw new Error(`Public asset differs from its source: /${file}`);
    }
  }
  const redirects = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8')).redirects ?? [];
  const endpoints = [...files].filter((file) => !file.endsWith('.html') && !file.startsWith('_astro/')).map((file) => `/${file}`).sort();
  const feedItems = {};
  if (files.has('rss.xml')) {
    for (const item of xmlValues(await readFile(path.join(dist, 'rss.xml'), 'utf8'), 'item')) {
      const link = xmlValues(item, 'link')[0];
      if (!link || feedItems[link]) throw new Error('RSS contains a missing or duplicate item link.');
      feedItems[link] = {
        title: xmlValues(item, 'title')[0] ?? null,
        description: xmlValues(item, 'description')[0] ?? null,
        published: xmlValues(item, 'pubDate')[0] ?? null,
      };
    }
  }
  const sitemapUrls = [];
  for (const file of [...files].filter((name) => /^sitemap-\d+\.xml$/.test(name))) {
    sitemapUrls.push(...xmlValues(await readFile(path.join(dist, file), 'utf8'), 'loc'));
  }
  return {
    version: 1, pages, articles, sourceHashes, publicAssets, endpoints, redirects, feedItems,
    sitemapUrls: [...new Set(sitemapUrls)].sort(),
    referenceIssues: findReferenceIssues(parsedPages, files),
  };
}

/** Compare nested data independently of object key order; array order remains meaningful. */
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}

/** New pages/content are allowed; removals and changes to protected facts require review. */
export function compareSnapshots(expected, actual) {
  const failures = [];
  if (expected.version !== 1 || actual.version !== 1) return ['Unsupported preservation manifest version'];
  for (const section of ['pages', 'articles', 'sourceHashes', 'publicAssets', 'feedItems']) {
    for (const [key, value] of Object.entries(expected[section])) {
      if (!(key in actual[section])) failures.push(`${section}: missing ${key}`);
      else if (JSON.stringify(stable(value)) !== JSON.stringify(stable(actual[section][key]))) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          for (const field of Object.keys(value)) {
            if (JSON.stringify(stable(value[field])) !== JSON.stringify(stable(actual[section][key][field]))) {
              failures.push(`${section}: changed ${key} (${field})`);
            }
          }
        } else failures.push(`${section}: changed ${key}`);
      }
    }
  }
  for (const endpoint of expected.endpoints) {
    if (!actual.endpoints.includes(endpoint)) failures.push(`endpoint: missing ${endpoint}`);
  }
  for (const url of expected.sitemapUrls) {
    if (!actual.sitemapUrls.includes(url)) failures.push(`sitemap: missing ${url}`);
  }
  // New rules may be appended. Inserting ahead of an existing rule can shadow it.
  expected.redirects.forEach((redirect, index) => {
    if (JSON.stringify(stable(actual.redirects[index])) !== JSON.stringify(stable(redirect))) {
      failures.push(`redirect: missing, changed or reordered ${redirect.source} at position ${index + 1}`);
    }
  });
  return failures;
}

/** Exact exceptions are documented individually; resolved exceptions are reported, not hidden. */
export function compareDebt(issues, debt) {
  for (const entry of debt) {
    if (!entry.issue || !entry.owner || !entry.reason) throw new Error('Every debt entry needs issue, owner, and reason.');
  }
  const known = new Set(debt.map((entry) => entry.issue));
  return {
    unexpected: issues.filter((issue) => !known.has(issue)),
    resolved: debt.filter((entry) => !issues.includes(entry.issue)).map((entry) => entry.issue),
  };
}
