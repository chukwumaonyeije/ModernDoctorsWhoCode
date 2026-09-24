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
  const filename = origin.includes('127.0.0.1') ? 'getdial-opt-in-preview.png' : 'getdial-opt-in-live.png';
  await page.screenshot({ path: resolve(output, filename), fullPage: true });
  if ((await stat(resolve(output, filename))).size > 2 * 1024 * 1024) throw new Error('Screenshot exceeds Get Dial upload limit.');
  await writeFile(resolve(output, filename.replace('.png', '.json')), JSON.stringify({ url: page.url(), capturedAt: new Date().toISOString(), checkboxChecked: false, screenshot: filename }, null, 2));
  console.log(resolve(output, filename));
} finally {
  await browser.close();
}
