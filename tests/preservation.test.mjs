import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  captureSite, compareDebt, compareSnapshots, findReferenceIssues, inspectArticle,
  inspectHtml, pageRoute, resolveTarget, textHash,
} from '../scripts/lib/preservation.mjs';

/** Minimal baseline with enough structure to exercise destructive regressions. */
function baseline() {
  return {
    version: 1,
    pages: { '/blog/example/': { canonical: ['https://www.doctorswhocode.blog/blog/example'] } },
    articles: { 'example.mdx': { id: 'example', bodyHash: 'original', frontmatter: { audioUrl: '/audio/example.mp3' } } },
    sourceHashes: { 'special.astro': 'original' },
    publicAssets: { '/audio/example.mp3': 'original' },
    endpoints: ['/rss.xml', '/search-index.json'],
    redirects: [{ source: '/feed', destination: '/rss.xml', permanent: true }],
    feedItems: { '/blog/example/': { title: 'Example', published: '2026-09-15' } },
    sitemapUrls: ['https://www.doctorswhocode.blog/blog/example/'],
  };
}

test('protected content, canonical, route, media, endpoint and redirect regressions fail', () => {
  const mutations = [
    (s) => { s.articles['example.mdx'].bodyHash = 'edited'; },
    (s) => { s.pages['/blog/example/'].canonical = ['https://other.example/']; },
    (s) => { delete s.pages['/blog/example/']; },
    (s) => { delete s.articles['example.mdx']; },
    (s) => { delete s.articles['example.mdx'].frontmatter.audioUrl; },
    (s) => { delete s.publicAssets['/audio/example.mp3']; },
    (s) => { s.publicAssets['/audio/example.mp3'] = 'replaced'; },
    (s) => { s.endpoints = ['/rss.xml']; },
    (s) => { s.redirects[0].destination = '/blog'; },
    (s) => { s.sourceHashes['special.astro'] = 'changed'; },
    (s) => { delete s.feedItems['/blog/example/']; },
    (s) => { s.sitemapUrls = []; },
  ];
  for (const mutate of mutations) {
    const original = baseline();
    const actual = structuredClone(original);
    mutate(actual);
    assert.ok(compareSnapshots(original, actual).length, mutate.toString());
  }
});

test('new articles and routes are allowed; redirect order remains protected', () => {
  const original = baseline();
  const actual = structuredClone(original);
  actual.articles['new.mdx'] = { id: 'new' };
  actual.pages['/new/'] = { canonical: [] };
  assert.deepEqual(compareSnapshots(original, actual), []);
  original.redirects.push({ source: '/old', destination: '/new', permanent: true });
  actual.redirects = [...original.redirects].reverse();
  assert.match(compareSnapshots(original, actual).join('\n'), /reordered/);
  actual.redirects = [{ source: '/:path*', destination: '/new', permanent: true }, ...original.redirects];
  assert.match(compareSnapshots(original, actual).join('\n'), /redirect:/);
  actual.redirects = [...original.redirects, { source: '/new-old', destination: '/new', permanent: true }];
  assert.deepEqual(compareSnapshots(original, actual), []);
});

test('article hashing tolerates checkout line endings but catches text changes and explicit slugs', () => {
  const article = '---\ntitle: Example\nslug: stable-id\npubDate: 2026-09-15\n---\nOriginal paragraph.\n';
  const lf = inspectArticle(article, '🧠-example.mdx');
  assert.equal(lf.id, 'stable-id');
  assert.equal(lf.bodyHash, inspectArticle(article.replaceAll('\n', '\r\n'), '🧠-example.mdx').bodyHash);
  assert.notEqual(lf.bodyHash, inspectArticle(article.replace('Original', 'Changed'), 'example.mdx').bodyHash);
  assert.equal(textHash('a\r\nb'), textHash('a\nb'));
});

test('HTML parsing ignores escaped examples and JS strings, but extracts encoded real links', () => {
  const page = inspectHtml('<div id="a&amp;b"></div><a href="#a&amp;b">Link</a><pre>&lt;img src="/fake.png"&gt;</pre><script>const example = \'<a href="/fake/">\';</script><img srcset="/one.webp 1x, /two.webp 2x"><video poster="/poster.jpg"></video>');
  assert.ok(page.ids.has('a&b'));
  assert.deepEqual(page.references.map((ref) => ref.url), ['#a&b', '/one.webp', '/two.webp', '/poster.jpg']);
});

test('article media protection excludes changing related-post cards and hashed scripts', () => {
  const page = inspectHtml('<img class="post-feature-image" src="/hero.png"><div class="prose"><img src="/body.png"><audio src="/clip.mp3"></audio></div><img class="post-card-image" src="/related.png"><script src="/_astro/new-hash.js"></script>');
  assert.deepEqual(page.contentMedia, [
    { tag: 'img', src: '/hero.png' }, { tag: 'img', src: '/body.png' }, { tag: 'audio', src: '/clip.mp3' },
  ]);
});

test('random newsletter instance IDs do not create preservation failures between identical builds', () => {
  const first = inspectHtml('<h1 id="article-title">Title</h1><h2 id="durable-anchor">Section</h2><h2 id="newsletter-abc123-signup-title">Subscribe</h2>');
  const second = inspectHtml('<h1 id="article-title">Title</h1><h2 id="durable-anchor">Section</h2><h2 id="newsletter-def456-signup-title">Subscribe</h2>');
  assert.deepEqual(first.headings, ['article-title', 'durable-anchor']);
  assert.deepEqual(first.headings, second.headings);
});

test('code protection ignores highlighting spans but preserves code text and indentation', () => {
  const article = (code) => inspectHtml(`<div class="prose"><p>Example</p><pre><code>${code}</code></pre></div>`).bodyTextHash;
  const original = article('&lt;RiskCalculator /&gt;\n  return 1');
  assert.equal(original, article('<span>&lt;</span><span>RiskCalculator</span> /&gt;\n  <span>return</span> 1'));
  assert.notEqual(original, article('&lt;RiskCalculator /&gt;\n return 1'));
  assert.notEqual(original, article('&lt;RiskCalculator /&gt;\n  return 2'));
});

test('local fragments, encoded paths, missing media, and opaque external URLs are handled', () => {
  const files = new Set(['index.html', 'blog/café/index.html', 'image.png']);
  const pages = new Map([
    ['index.html', inspectHtml('<a href="/blog/caf%C3%A9/#known">Good</a><a href="/blog/caf%C3%A9/#missing">Bad</a><img src="/gone.png"><a href="https://external.test/#missing">External</a><a href="#top">Top</a><script src="/_vercel/insights/script.js"></script>')],
    ['blog/café/index.html', inspectHtml('<h2 id="known">Heading</h2>')],
  ]);
  const issues = findReferenceIssues(pages, files);
  assert.equal(issues.length, 2);
  assert.ok(issues.some((issue) => issue.includes('missing-fragment')));
  assert.ok(issues.some((issue) => issue.includes('/gone.png')));
  assert.equal(resolveTarget('/blog/caf%C3%A9/', files), 'blog/café/index.html');
  assert.equal(resolveTarget('/%2e%2e/secret', files), undefined);
  assert.equal(resolveTarget('/%zz', files), undefined);
  assert.equal(pageRoute('blog/café/index.html'), '/blog/café/');
});

test('debt exemptions require ownership, match exactly, and report resolved items', () => {
  const debt = [{ issue: 'missing-fragment | / | /#old', owner: 'Reading experience', reason: 'Existing anchor' }];
  assert.deepEqual(compareDebt([debt[0].issue], debt), { unexpected: [], resolved: [] });
  assert.equal(compareDebt(['missing-fragment | / | /#new'], debt).unexpected.length, 1);
  assert.equal(compareDebt([], debt).resolved.length, 1);
  assert.throws(() => compareDebt([], [{ issue: 'x' }]), /owner/);
});

test('capture validates a real temporary source/build fixture without modifying inputs', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'dwc-preservation-test-'));
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve(tmpdir()));
    assert.ok(path.basename(root).startsWith('dwc-preservation-test-'));
    return rm(root, { recursive: true, force: true });
  });
  const fixture = {
    'dist/index.html': '<html><title>Home</title></html>',
    'dist/blog/example/index.html': '<link rel="canonical" href="https://www.doctorswhocode.blog/blog/example/"><div class="prose">Original paragraph.</div>',
    'src/content/blog/posts/example.md': '---\ntitle: Example\npubDate: 2026-09-15\n---\nOriginal paragraph.\n',
    'src/pages/blog/docling-rag-tutorial.astro': 'Special article',
    'src/pages/blog/internal-mfm-scoring-optimization-engine.astro': 'Protected source',
    'src/content/internal/mfm-scoring-optimization-engine.html': 'Slide source',
    'public/audio/example.mp3': 'fixture audio bytes',
    'dist/audio/example.mp3': 'fixture audio bytes',
    'vercel.json': '{"redirects":[]}',
    'dist/rss.xml': '<rss><channel><item><title>Example</title><link>https://www.doctorswhocode.blog/blog/example/</link><pubDate>Tue, 15 Sep 2026 00:00:00 GMT</pubDate></item></channel></rss>',
    'dist/sitemap-0.xml': '<urlset><url><loc>https://www.doctorswhocode.blog/blog/example/</loc></url></urlset>',
  };
  for (const [file, contents] of Object.entries(fixture)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), contents);
  }
  const before = await captureSite(root);
  assert.equal(Object.keys(before.articles).length, 1);
  assert.deepEqual(before.referenceIssues, []);
  assert.equal(Object.keys(before.feedItems).length, 1);
  assert.equal(before.sitemapUrls.length, 1);
  assert.equal(await readFile(path.join(root, 'src/content/blog/posts/example.md'), 'utf8'), fixture['src/content/blog/posts/example.md']);
  await writeFile(path.join(root, 'src/content/blog/posts/example.md'), fixture['src/content/blog/posts/example.md'].replace('Original', 'Changed'));
  assert.match(compareSnapshots(before, await captureSite(root)).join('\n'), /bodyHash/);
  await rm(path.join(root, 'dist/audio/example.mp3'));
  await assert.rejects(captureSite(root), /Public asset missing from build/);
});
