import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const distDir = path.resolve(root, 'dist');
const baselinePath = path.resolve(root, 'baseline', 'protected-routes.json');
const writeBaseline = process.argv.includes('--write-baseline');
const siteOrigin = 'https://www.doctorswhocode.blog';
const criticalEndpoints = [
  '/ai.txt',
  '/favicon.ico',
  '/favicon.svg',
  '/llms.txt',
  '/robots.txt',
  '/rss.xml',
  '/sitemap-0.xml',
  '/sitemap-index.xml',
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(absolute));
    } else if (entry.isFile()) {
      files.push(absolute);
    }
  }

  return files;
}

function toPublicPath(absolutePath) {
  return `/${path.relative(distDir, absolutePath).split(path.sep).join('/')}`;
}

function toPageRoute(absolutePath) {
  const publicPath = toPublicPath(absolutePath);

  if (publicPath === '/index.html') return '/';
  if (publicPath.endsWith('/index.html')) {
    return `${publicPath.slice(0, -'index.html'.length)}`;
  }

  return publicPath;
}

async function fileExists(absolutePath) {
  try {
    await access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function assertBuildExists() {
  if (!await fileExists(distDir)) {
    throw new Error('Missing dist/. Run `npm run build` before site guardrails.');
  }
}

async function createSnapshot() {
  const files = await walk(distDir);
  const pages = files
    .filter((file) => file.endsWith('.html'))
    .map(toPageRoute)
    .sort((a, b) => a.localeCompare(b));
  const presentCriticalEndpoints = [];

  for (const endpoint of criticalEndpoints) {
    if (await publicTargetExists(endpoint)) presentCriticalEndpoints.push(endpoint);
  }

  return {
    version: 1,
    pageCount: pages.length,
    pages,
    criticalEndpoints: presentCriticalEndpoints,
  };
}

function decodeHtmlAttribute(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function extractHrefs(html) {
  const hrefs = [];
  const pattern = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  const markup = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  for (const match of markup.matchAll(pattern)) {
    hrefs.push(decodeHtmlAttribute(match[1] ?? match[2] ?? match[3] ?? ''));
  }

  return hrefs;
}

async function publicTargetExists(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const relativePath = decodedPath.replace(/^\/+/, '');
  const absolute = path.resolve(distDir, relativePath);
  const relativeToDist = path.relative(distDir, absolute);

  if (relativeToDist.startsWith('..') || path.isAbsolute(relativeToDist)) return false;

  const candidates = decodedPath.endsWith('/')
    ? [path.join(absolute, 'index.html')]
    : [absolute, `${absolute}.html`, path.join(absolute, 'index.html')];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return true;
  }

  return false;
}

async function findBrokenInternalLinks(htmlFiles) {
  const failures = new Map();

  for (const file of htmlFiles) {
    const sourceRoute = toPageRoute(file);
    const html = await readFile(file, 'utf8');

    for (const rawHref of extractHrefs(html)) {
      const href = rawHref.trim();
      if (!href || href.startsWith('#')) continue;
      if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;

      let url;
      try {
        url = new URL(href, `${siteOrigin}${sourceRoute}`);
      } catch {
        failures.set(`${sourceRoute} -> ${href}`, 'invalid URL');
        continue;
      }

      if (url.origin !== siteOrigin) continue;
      if (await publicTargetExists(url.pathname)) continue;

      failures.set(`${sourceRoute} -> ${url.pathname}`, 'missing target');
    }
  }

  return [...failures.keys()].sort((a, b) => a.localeCompare(b));
}

async function validateAgainstBaseline(snapshot, brokenLinks) {
  if (!await fileExists(baselinePath)) {
    throw new Error('Missing baseline/protected-routes.json. Run `npm run baseline:routes` once to create it.');
  }

  const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
  const currentPages = new Set(snapshot.pages);
  const currentEndpoints = new Set(snapshot.criticalEndpoints);
  const missingPages = baseline.pages.filter((route) => !currentPages.has(route));
  const missingEndpoints = baseline.criticalEndpoints.filter((route) => !currentEndpoints.has(route));

  if (missingPages.length || missingEndpoints.length) {
    const missing = [...missingPages, ...missingEndpoints].map((route) => `  - ${route}`).join('\n');
    throw new Error(`Protected public routes disappeared from the build:\n${missing}`);
  }

  console.log(`Protected route check passed: ${baseline.pages.length} pages and ${baseline.criticalEndpoints.length} critical endpoints remain available.`);
  if (snapshot.pages.length > baseline.pages.length) {
    console.log(`Current build adds ${snapshot.pages.length - baseline.pages.length} page(s) beyond the protected baseline.`);
  }

  const knownBrokenLinks = new Set(baseline.knownBrokenLinks ?? []);
  const newBrokenLinks = brokenLinks.filter((link) => !knownBrokenLinks.has(link));

  if (newBrokenLinks.length > 0) {
    const details = newBrokenLinks.slice(0, 50).map((link) => `  - ${link}`).join('\n');
    const remainder = newBrokenLinks.length > 50 ? `\n  ...and ${newBrokenLinks.length - 50} more` : '';
    throw new Error(`Found ${newBrokenLinks.length} new broken internal link(s):\n${details}${remainder}`);
  }

  if (brokenLinks.length > 0) {
    console.log(`Internal link check passed with ${brokenLinks.length} known baseline issue(s) and no new failures.`);
  } else {
    console.log('Internal link check passed with no broken links.');
  }
}

await assertBuildExists();
const snapshot = await createSnapshot();
const allFiles = await walk(distDir);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const brokenLinks = await findBrokenInternalLinks(htmlFiles);

if (writeBaseline) {
  snapshot.knownBrokenLinks = brokenLinks;
  await writeFile(baselinePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${snapshot.pageCount} protected pages to ${path.relative(root, baselinePath)}.`);
  console.log(`Recorded ${brokenLinks.length} known internal-link issue(s) as baseline debt.`);
} else {
  await validateAgainstBaseline(snapshot, brokenLinks);
}
console.log(`Scanned internal links across ${htmlFiles.length} HTML files.`);
