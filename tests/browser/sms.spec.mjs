import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  // Browser QA must not send a message, subscribe anyone, or load external analytics.
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.abort());
  await page.goto('/text-updates/');
});

test('initial disclosure is readable, unchecked, optional, and linked to real policies', async ({ page }) => {
  const consent = page.locator('#sms-consent');
  await expect(consent).not.toBeChecked();
  await expect(consent).not.toHaveAttribute('required');
  await expect(page.locator('#sms-phone')).toHaveAttribute('required');
  await expect(page.locator('#sms-next-step')).toBeHidden();
  for (const text of ['Message frequency varies.', 'Message and data rates may apply.', 'Reply STOP to cancel or HELP for help.']) {
    await expect(page.locator('label[for="sms-consent"]')).toContainText(text);
  }
  for (const path of ['/privacy/', '/terms/']) {
    const response = await page.request.get(path);
    expect(response.status()).toBe(200);
  }
});

test('unchecked consent never creates signup instructions or a network submission', async ({ page }) => {
  const submissions = [];
  page.on('request', request => {
    if (request.method() === 'POST' || request.url().includes('2015550123')) submissions.push(request.url());
  });
  await page.locator('#sms-phone').fill('2015550123');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('#sms-status')).toContainText('You have not signed up');
  await expect(page.locator('#sms-next-step')).toBeHidden();
  expect(submissions).toEqual([]);
  expect(page.url()).not.toContain('2015550123');
});

test('invalid phone is rejected; valid consent prepares but does not send a message', async ({ page }) => {
  await page.locator('#sms-phone').fill('123');
  await page.locator('#sms-consent').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('#sms-next-step')).toBeHidden();
  expect(await page.locator('#sms-phone').evaluate(input => input.validity.valid)).toBe(false);
  await page.locator('#sms-phone').fill('+1 (201) 555-0123');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('#sms-next-step')).toBeVisible();
  await expect(page.locator('#sms-status')).toContainText('Nothing has been sent');
  await expect(page.locator('#sms-message')).toHaveValue(/DWC OPT IN 2026-09-24/);
  await expect(page.locator('#sms-message')).toHaveValue(/https:\/\/www.doctorswhocode.blog\/privacy\//);
  await expect(page.locator('#sms-sending-number')).toHaveText('(201) 555-0123');
  await expect(page.locator('#sms-next-heading')).toBeFocused();
  // Inspect the SMS recipient without invoking an external app.
  await expect(page.locator('#sms-open-app')).toHaveAttribute('href', 'sms:+17638787305');
  await page.locator('#sms-consent').uncheck();
  await expect(page.locator('#sms-next-step')).toBeHidden();
});

test('edits and reload invalidate previous consent', async ({ page }) => {
  await page.locator('#sms-phone').fill('2015550123');
  await page.locator('#sms-consent').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('#sms-phone').fill('2025550123');
  await expect(page.locator('#sms-next-step')).toBeHidden();
  await page.reload();
  await expect(page.locator('#sms-consent')).not.toBeChecked();
});

test('both themes fit and expose accessible controls', async ({ page }) => {
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const result = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
  }
});

test('without JavaScript the form cannot leak a number through navigation', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.abort());
  await page.goto('http://127.0.0.1:4321/text-updates/');
  await expect(page.locator('#sms-phone')).toBeDisabled();
  await expect(page.locator('noscript p')).toContainText('No information has been submitted');
  await context.close();
});
