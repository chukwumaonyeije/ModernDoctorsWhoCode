import { chromium } from 'playwright';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:4321';
const output = resolve('test-results/sms');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto(`${origin}/text-updates/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (await page.locator('#sms-consent').isChecked()) throw new Error('Screenshot requires unchecked consent.');
  if (await page.locator('#sms-phone').isDisabled()) throw new Error('Signup script did not initialize.');
  const filename = origin.includes('127.0.0.1') ? 'getdial-opt-in-preview-complete.png' : 'getdial-opt-in-live-complete.png';
  await page.screenshot({ path: resolve(output, filename), fullPage: true });
  if ((await stat(resolve(output, filename))).size > 2 * 1024 * 1024) throw new Error('Screenshot exceeds Get Dial upload limit.');
  await writeFile(resolve(output, filename.replace('.png', '.json')), JSON.stringify({ url: page.url(), capturedAt: new Date().toISOString(), checkboxChecked: false, screenshot: filename }, null, 2));
  console.log(resolve(output, filename));
  // Exercise only browser-local preparation using a reserved fictional number. Never open the SMS URI.
  await page.locator('#sms-phone').fill('2015550123');
  await page.locator('#sms-consent').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('#sms-next-step').waitFor({ state: 'visible' });
  await page.locator('h1').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  const stepTwoFilename = filename.replace('.png', '-step-2.png');
  await page.screenshot({ path: resolve(output, stepTwoFilename), fullPage: true });
  if ((await stat(resolve(output, stepTwoFilename))).size > 2 * 1024 * 1024) throw new Error('Step-two screenshot exceeds Get Dial upload limit.');
  await writeFile(resolve(output, stepTwoFilename.replace('.png', '.json')), JSON.stringify({ url: page.url(), capturedAt: new Date().toISOString(), checkboxChecked: true, fictionalExampleNumber: '2015550123', messageSent: false, screenshot: stepTwoFilename }, null, 2));
  console.log(resolve(output, stepTwoFilename));
} finally {
  await browser.close();
}
