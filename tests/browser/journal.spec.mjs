import { test, expect } from '@playwright/test';

test('Journal searches article bodies, persists queries, and limits featured picks', async ({ page }) => {
  await page.goto('/blog/', { waitUntil: 'domcontentloaded' });
  const search = page.getByRole('searchbox', { name: 'Search articles' });
  await search.fill('keyboard proctor');
  await expect(page.locator('.post-item:visible')).toHaveCount(1);
  await expect(page.locator('.post-item:visible')).toContainText('Typing Olympics');
  await search.press('Enter');
  await expect(page).toHaveURL(/q=keyboard\+proctor/);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.post-item:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear search and filters', exact: true }).first().click();
  await page.locator('select[name=selection]').selectOption('featured');
  await expect(page.locator('.post-item:visible')).toHaveCount(3);
  await expect(page.locator('#article-result-count')).toHaveText('3 articles');
  await search.fill('no-such-article-zzzzz');
  await expect(page.locator('#no-results')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search and filters', exact: true }).last().click();
  await expect(page.locator('#no-results')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Journal sort is chronological and failed index requests can retry', async ({ page }) => {
  await page.route('**/search-index.json', (route) => route.abort(), { times: 1 });
  await page.goto('/blog/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('searchbox').fill('typing');
  await expect(page.locator('#article-result-count')).toContainText('temporarily unavailable');
  await page.getByRole('searchbox').fill('typing olympics');
  await expect(page.locator('.post-item:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear search and filters', exact: true }).first().click();
  const records = await page.request.get('/search-index.json').then(r => r.json());
  await page.locator('select[name=sort]').selectOption('oldest');
  const oldest = [...records].sort((a, b) => Date.parse(a.published) - Date.parse(b.published))[0];
  await expect(page.locator('.post-item:visible').first()).toHaveAttribute('data-post-id', oldest.id);
  await page.locator('select[name=sort]').selectOption('newest');
  const newest = [...records].sort((a, b) => Date.parse(b.published) - Date.parse(a.published))[0];
  await expect(page.locator('.post-item:visible').first()).toHaveAttribute('data-post-id', newest.id);
});
