import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4321' ? route.continue() : route.abort());
});

test('short viewport keeps every menu control reachable by keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 256 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  const panel = page.locator('[data-nav-panel]');
  const controls = panel.locator('a, select, summary');
  for (let i = 0; i < await controls.count(); i++) {
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveCSS('outline-style', 'solid');
    const box = await focused.boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(257);
  }
  await page.keyboard.press('Tab');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('skip link moves keyboard focus into main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip to/i })).toBeFocused();
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('main-content');
});

test('shared templates reflow with enlarged text at narrow widths', async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of [320, 640]) {
    await page.setViewportSize({ width, height: 400 });
    for (const path of ['/', '/start/', '/paths/', '/courses/', '/projects/', '/channels/', '/about/', '/contact/']) {
      await page.goto(path);
      // Text enlargement complements, but does not replace, real browser zoom acceptance.
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('[data-site-header]')).toHaveCSS('position', 'static');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: ${path}`).toBe(true);
    }
  }
});
