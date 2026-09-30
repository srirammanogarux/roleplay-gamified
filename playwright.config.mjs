import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 6 * 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    viewport: { width: 412, height: 917 },
    launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] },
  },
  webServer: process.env.BASE_URL ? undefined : {
    command: 'node tests/serve.mjs',
    url: 'http://localhost:4173/index.html',
    reuseExistingServer: true,
  },
});
