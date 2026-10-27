// Reproducible visual QA with labelled local fixtures; never an authenticated production capture.
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { installDashboardFixtures } from './dashboard-fixtures.mjs'
const base = process.env.DASHBOARD_TEST_URL || 'http://127.0.0.1:5185'
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) throw new Error('Visual QA requires a local fixture server.')
const destination = path.resolve(process.argv[2] || 'docs/dashboard/screenshots')
fs.mkdirSync(destination, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', headless: true })
const results = []
try {
  for (const locale of ['en', 'ar']) for (const width of [1440, 1536, 1920, 1024, 768, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } })
    await installDashboardFixtures(page, { locale })
    await page.route('**/organization/fetch_organization_app_status_details', route => route.fulfill({ json: { status: true, data: { progress: 100, progressItems: [] } } }))
    await page.addInitScript(() => { const state = JSON.parse(localStorage.getItem('user')); state.user.organizationName = 'Demo organization'; localStorage.setItem('user', JSON.stringify(state)) })
    await page.goto(base + '/organization')
    const root = page.getByTestId('organization-command-center')
    await root.locator('.command-metric-value').first().waitFor()
    await page.waitForFunction(() => !document.querySelector('.org-command [aria-busy="true"]'))
    const filename = `organization-dashboard-${locale}-${width}.png`
    await page.screenshot({ path: path.join(destination, filename), fullPage: true, animations: 'disabled' })
    results.push({ file: filename, locale, width, fixtureData: true, ...await page.evaluate(() => ({ height: document.documentElement.scrollHeight, horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2 })) })
    await page.close()
  }
} finally { await browser.close() }
fs.writeFileSync(path.join(destination, 'screenshots.json'), JSON.stringify(results, null, 2) + '\n')
console.log(JSON.stringify(results))
