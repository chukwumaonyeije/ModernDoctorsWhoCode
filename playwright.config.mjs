import { defineConfig } from '@playwright/test';
export default defineConfig({
  outputDir: './test-results/playwright',
  testDir: './tests/browser', testMatch: '**/*.spec.mjs', workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4321', channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined), trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'node tests/browser/preview.mjs', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI, timeout: 60_000, env: { ASTRO_TELEMETRY_DISABLED: '1' } },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
});
