import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './scripts',
  timeout: 120_000,
  retries: 0,
  workers: 1,
  use: {
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
})
