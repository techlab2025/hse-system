import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: '.',
  timeout: 180_000,
  retries: 0,
  workers: 1,
  outputDir: '/tmp/hse-project-playwright',
  reporter: [['list'], ['json', { outputFile: '/tmp/hse-project-playwright-results.json' }]],
  use: {
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    baseURL: process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5186',
  },
})
