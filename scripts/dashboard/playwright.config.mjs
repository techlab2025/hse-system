import { defineConfig } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  timeout: 60000,
  expect: { timeout: 10000 },
  workers: 1,
  use: { channel: 'chromium', headless: true, viewport: { width: 1440, height: 1000 } },
  outputDir: path.join(os.tmpdir(), 'hse-dashboard-browser-results'),
})
