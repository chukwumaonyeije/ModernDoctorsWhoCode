import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { preview } from 'astro';

// A controlled font-swap experiment, not a field Core Web Vitals measurement.
const label = process.argv[2] || 'current';
if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Use a simple report label.');
const server = await preview({ root: process.cwd(), server: { host: '127.0.0.1', port: 4322 } });
const origin = 'http://127.0.0.1:4322';
let browser;
const results = [];
try {
  if (server.port !== 4322) throw new Error('Typography review requires dedicated port 4322.');
  browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined });
  for (const width of [375, 1440]) {
    for (const path of ['/', '/courses/clinical-ai-literacy/', '/blog/physician-developer-stack-mdx/']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      let release;
      const gate = new Promise(resolve => { release = resolve; });
      const fonts = [];
      await context.route('**/*', async route => {
        const request = route.request();
        if (new URL(request.url()).origin !== origin) return route.abort();
        if (request.resourceType() === 'font') {
          fonts.push(request.url().replace(origin, ''));
          await gate;
        }
        return route.continue();
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.fontShifts = [];
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.fontShifts.push(entry.value);
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);
      const measure = () => page.evaluate(() => {
        const heading = document.querySelector('h1');
        const box = heading.getBoundingClientRect();
        return { heading: { x: box.x, y: box.y, width: box.width, height: box.height },
          bodyFont: getComputedStyle(document.body).fontFamily,
          headingFont: getComputedStyle(heading).fontFamily,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          shifts: window.fontShifts.reduce((sum, value) => sum + value, 0) };
      });
      const fallback = await measure();
      release();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      const loaded = await measure();
      const resources = await page.evaluate(() => performance.getEntriesByType('resource')
        .filter(entry => /\.woff2?(?:$|\?)/.test(entry.name))
        .map(entry => ({ url: new URL(entry.name).pathname, bytes: entry.decodedBodySize })));
      results.push({ path, width, fallback, loaded, fontSwapShift: loaded.shifts - fallback.shifts, fonts, resources });
      await context.close();
    }
  }
  await mkdir('test-results/typography', { recursive: true });
  await writeFile(`test-results/typography/${label}.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ path, width, fontSwapShift, resources, loaded }) =>
    ({ path, width, fontSwapShift, fontBytes: resources.reduce((sum, r) => sum + r.bytes, 0), heading: loaded.heading })), null, 2));
} finally {
  await browser?.close();
  await server.stop();
}
