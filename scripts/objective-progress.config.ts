import { defineConfig } from '@playwright/test'
import base from '../playwright.config'
export default defineConfig({
  ...base,
  testDir: '.',
  outputDir: '/tmp/objective-progress-test-results',
  testMatch: 'objective-progress*.spec.ts',
  tsconfig: '../tsconfig.app.json',
  use: { ...base.use, baseURL: process.env.OBJECTIVE_TEST_URL || 'http://127.0.0.1:5187' },
})
