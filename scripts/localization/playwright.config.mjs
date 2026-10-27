import { defineConfig } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import path from 'node:path'

export default defineConfig({
  testDir: fileURLToPath(new URL('../', import.meta.url)),
  testMatch: 'localization-runtime.spec.mjs',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  use: { channel: 'chromium', headless: true, viewport: { width: 1440, height: 1000 } },
  outputDir: path.join(os.tmpdir(), 'hse-localization-test-results'),
})
