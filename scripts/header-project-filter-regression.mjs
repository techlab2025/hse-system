/** With Vite running: node scripts/header-project-filter-regression.mjs [http://127.0.0.1:5180] */
import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'
const origin = process.argv[2] || 'http://127.0.0.1:5180'
const browser = await chromium.launch({ channel: 'chromium', headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await installFixtures(page)
  const calls = []
  const collections = new Set([
    'fetch_corrective_action_plan',
    'fetch_preventive_action_plan',
    'fetch_investigations_lesson_learnt',
    'fetch_equipments',
    'fetch_induction',
    'fetch_management_of_changes',
    'fetch_today_talks',
    'fetch_internal_audits',
    'fetch_observations',
    'fetch_tasks',
    'fetch_capas',
    'fetch_investigations',
  ])
  await page.route('https://api.hse.techlabeg.com/**', async (route) => {
    const request = route.request()
    const endpoint = new URL(request.url()).pathname.split('/').pop()
    const payload = request.postDataJSON() || {}
    calls.push({ endpoint, payload })
    let data
    if (endpoint === 'fetch_my_projects')
      data = [
        { id: 41, title: 'Project Alpha', titles: [{ locale: 'en', title: 'Project Alpha' }] },
        { id: 52, title: 'Project Beta', titles: [{ locale: 'en', title: 'Project Beta' }] },
      ]
    else if (endpoint === 'update_organization_employee_default_project')
      data = {
        id: 1,
        name: 'Visual test',
        employee_type: 2,
        is_master: 1,
        type: 2,
        permissions: [],
        languages: [],
      }
    else if (collections.has(endpoint)) data = []
    else return route.fallback()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, data, message: 'OK' }),
    })
  })
  const requests = (endpoint) => calls.filter((call) => call.endpoint === endpoint)
  const selectProject = async (label) => {
    await page.locator('.header-select .p-select').click()
    await page.getByRole('option', { name: label, exact: true }).click()
    await expect(page.locator('.header-select .p-select')).not.toHaveClass(/p-disabled/)
  }
  for (const [path, endpoint, field = 'project_id'] of [
    ['/organization/equipment-mangement/observation', 'fetch_observations', 'project_ids'],
    ['/organization/equipment-mangement/incedant', 'fetch_observations', 'project_ids'],
    ['/organization/equipment-mangement/inspection', 'fetch_tasks', 'project_ids'],
    ['/organization/capa', 'fetch_capas', 'project_ids'],
    ['/organization/Investigating?isAll=1', 'fetch_investigations'],
    ['/organization/corrective-report', 'fetch_corrective_action_plan'],
    ['/organization/preventive-report', 'fetch_preventive_action_plan'],
    ['/organization/lessons-learnt-report', 'fetch_investigations_lesson_learnt'],
    ['/organization/equipments', 'fetch_equipments'],
    ['/organization/inductions', 'fetch_induction'],
    ['/organization/management-of-change', 'fetch_management_of_changes'],
    ['/organization/today-talks', 'fetch_today_talks'],
    ['/organization/internal-audit/register', 'fetch_internal_audits'],
  ]) {
    await page.goto(`${origin}${path}`)
    await page.waitForSelector('.header-select .p-select')
    await expect.poll(() => requests(endpoint).length).toBeGreaterThan(0)
    const token = `no-reload-${endpoint}`
    await page.evaluate((token) => {
      window.projectTestToken = token
    }, token)
    for (const [label, projectId] of [
      ['Project Alpha', 41],
      ['Project Beta', 52],
      ['All Projects', undefined],
    ]) {
      const before = requests(endpoint).length
      await selectProject(label)
      await expect.poll(() => requests(endpoint).length).toBe(before + 1)
      const latest = requests(endpoint).at(-1).payload
      assert.deepEqual(
        latest[field],
        field === 'project_ids' && projectId ? [projectId] : projectId,
        `${path} ${label}`,
      )
      assert.ok(latest.page === undefined || latest.page === 1)
      assert.equal(await page.evaluate(() => window.projectTestToken), token)
    }
  }
  // Query-linked reports change/clear their URL filter together with the header.
  await page.goto(`${origin}/organization/corrective-report?project_id=41`)
  await page.waitForSelector('.header-select .p-select')
  await selectProject('Project Beta')
  await expect(page).toHaveURL(/project_id=52/)
  await expect
    .poll(() => requests('fetch_corrective_action_plan').at(-1).payload.project_id)
    .toBe(52)
  await selectProject('All Projects')
  await expect(page).toHaveURL(`${origin}/organization/corrective-report`)
  await expect
    .poll(() => requests('fetch_corrective_action_plan').at(-1).payload.project_id)
    .toBe(undefined)
  // A pinned project URL follows the selected project, preserving the current resource.
  await page.goto(`${origin}/organization/project-summary/41/data/drills`)
  await page.waitForSelector('.header-select .p-select')
  await selectProject('Project Beta')
  await expect(page).toHaveURL(`${origin}/organization/project-summary/52/data/drills`)
  await page.locator('.header-select .p-select').click()
  await page.getByRole('option', { name: 'All Projects', exact: true }).click()
  await expect(page).toHaveURL(`${origin}/organization/projects`)
  assert.deepEqual(errors, [])
  console.log(
    'PASS: 13 actual collection pages switch Alpha/Beta/All with one refresh and no browser reload; query filters and project resource URLs follow the header.',
  )
} finally {
  await browser.close()
}
