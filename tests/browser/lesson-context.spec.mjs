import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const lessonPath = '/blog/from-chatbot-to-agent-mental-model-for-physicians/';

test('course context exposes current lesson and real destinations without JavaScript', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4321' ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${lessonPath}`);
  const mobile = testInfo.project.name === 'mobile';
  const list = page.locator(mobile ? '.course-lesson-list--mobile' : '.post-sidebar .course-lesson-list');
  if (mobile) {
    await list.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(list).toHaveAttribute('open', '');
  }
  await expect(list.locator('[aria-current="page"]')).toHaveAttribute('href', lessonPath);
  const next = list.getByRole('link').filter({ hasText: 'The Harness' });
  await expect(next).toHaveCount(1);
  await next.click();
  await expect(page).toHaveURL(/\/blog\/the-harness-is-the-workplace\/$/);
  await context.close();
});

test('course context reflows and passes accessibility checks in both themes', async ({ page, context }, testInfo) => {
  await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4321' ? route.continue() : route.abort());
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(lessonPath);
    if (testInfo.project.name === 'mobile') await page.locator('.course-lesson-list--mobile summary').click();
    const scan = await new AxeBuilder({ page }).include('.course-lesson-list').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations).toEqual([]);
    await page.evaluate(() => document.documentElement.style.fontSize = '200%');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test('desktop sidebar scrolls focused lesson links into a short viewport', async ({ page, context }) => {
  await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4321' ? route.continue() : route.abort());
  await page.setViewportSize({ width: 1440, height: 400 });
  await page.goto(lessonPath);
  const links = page.locator('.post-sidebar a');
  for (const link of await links.all()) {
    await link.focus();
    const box = await link.boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(400);
  }
});
