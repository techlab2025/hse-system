import { test, expect, type Page } from '@playwright/test'
const objective = {
  id: 481,
  year: '2026',
  objective: 'Train employees in HSE',
  project: null,
  target_type: 1,
  direction: 1,
  department: { id: 2, title: 'Safety' },
  follow_up_employee: { id: 3, name: 'Sara' },
  target: 80,
  baseline: null,
  unit: null,
  frequency: null,
  annual_occurrences: null,
}
const record = {
  id: 1,
  objectiveId: 481,
  period: '2026-01',
  actualResult: 64,
  notes: 'Recorded result',
  attachments: [],
  recordedBy: 'Sara',
  recordedAt: '2026-01-25T12:00:00Z',
  createdAt: null,
  updatedAt: null,
  corrections: [],
  indicator: null,
}
async function fixtures(
  page: Page,
  {
    locale = 'en',
    connected = false,
    failSave = false,
    failDetails = false,
    failHistory = false,
    permitted = true,
  } = {},
) {
  const history: (typeof record)[] = []
  const requests: string[] = []
  await page.addInitScript(
    ({ locale, permitted }) => {
      localStorage.setItem('lang', locale)
      localStorage.setItem(
        'user',
        JSON.stringify({
          isAuth: true,
          expiresAt: Date.now() + 86400000,
          user: {
            id: 1,
            name: 'Test user',
            isMaster: permitted ? 1 : 0,
            type: 2,
            employeeType: 1,
            permission: [],
            languages: [],
            apiToken: 'test-only',
          },
        }),
      )
    },
    { locale, permitted },
  )
  if (connected)
    await page.route('**/objectiveProgressContract.ts*', async (route) => {
      const response = await route.fetch()
      // Test-only adapter: these URLs and normalized fixtures are NOT backend contracts.
      await route.fulfill({
        response,
        body:
          (await response.text()) +
          `\nObject.assign(objectiveProgressContract, {
confirmed:true, semantics:'cumulative', duplicates:'single',
endpoints:Object.fromEntries(['index','details','add','edit'].map(operation=>[operation,{method:'post',url:()=> 'https://api.hse.techlabeg.com/test-only/progress-'+operation}])),
encode:(operation,r)=>({objective_id:r.objectiveId,progress_id:r.progressId,...r.draft}),
decodeHistory:data=>({records:data}),decodeRecord:data=>data,decodeSummary:data=>data.fixtureSummary??null
});`,
      })
    })
  await page.route('https://api.hse.techlabeg.com/**', async (route) => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop()!
    requests.push(endpoint)
    let data: unknown = []
    if (endpoint === 'fetch_objectives')
      data = {
        data: [
          {
            ...objective,
            fixtureSummary: history.at(-1) ?? null,
            project_title: '',
            target_type_title: 'Percentage',
            direction_title: 'Increase',
            frequency_title: '',
          },
        ],
        meta: { total: 1, last_page: 1, current_page: 1, per_page: 10 },
      }
    if (endpoint === 'fetch_objectives_details') {
      if (failDetails)
        return route.fulfill({ status: 404, json: { status: false, message: 'Not found' } })
      data = objective
    }
    if (endpoint === 'progress-index') {
      if (failHistory)
        return route.fulfill({
          status: 500,
          json: { status: false, message: 'History unavailable' },
        })
      data = history
    }
    if (endpoint === 'progress-details') data = history[0]
    if (endpoint === 'progress-add' || endpoint === 'progress-edit') {
      if (failSave)
        return route.fulfill({
          status: 422,
          json: { status: false, message: 'Server rejected this result' },
        })
      const body = route.request().postDataJSON()
      const saved = {
        ...record,
        actualResult: body.actualResult,
        period: body.period,
        notes: body.notes,
      }
      history.splice(0, history.length, saved)
      data = saved
    }
    await route.fulfill({ json: { status: true, data, message: 'OK' } })
  })
  return { requests, history }
}
test('View dropdown navigates to details; edit/delete remain; unavailable progress is explicit', async ({
  page,
}) => {
  const { requests } = await fixtures(page)
  await page.goto('/organization/objectives')
  await expect(page.locator('.main-table tbody tr')).toHaveCount(1)
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    const sizes = await page.locator('.op-index .table-responsive').evaluate((element) => {
      const table = element.querySelector('table')!
      element.scrollLeft = 200
      return {
        width: element.getBoundingClientRect().width,
        viewport: innerWidth,
        scrollable: element.scrollWidth > element.clientWidth,
        scrolled: element.scrollLeft > 0,
        tableDisplay: getComputedStyle(table).display,
        rowDisplay: getComputedStyle(table.querySelector('tbody tr')!).display,
        pageFits: document.documentElement.scrollWidth <= innerWidth + 2,
      }
    })
    expect(sizes.width).toBeLessThanOrEqual(sizes.viewport)
    expect(sizes.scrollable).toBe(true)
    expect(sizes.scrolled).toBe(true)
    expect(sizes.tableDisplay).toBe('table')
    expect(sizes.rowDisplay).toBe('table-row')
    expect(sizes.pageFits).toBe(true)
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.locator('.list-trigger').click()
  await expect(page.getByRole('link', { name: /^edit$/i })).toHaveAttribute(
    'href',
    '/organization/objectives/481',
  )
  await page.getByRole('link', { name: 'View', exact: true }).click()
  await expect(page).toHaveURL(/481\/details$/)
  await expect(page.getByRole('heading', { name: 'Objective Details', exact: true })).toBeVisible()
  await expect(page.locator('.op-facts')).toContainText('Safety')
  await expect(
    page.getByText('Progress history is not available yet.', { exact: false }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Update Progress', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Save Progress', exact: true })).toBeEnabled()
  await page.locator('input[type=file]').setInputFiles({
    name: 'progress.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Progress attachment'),
  })
  await expect(page.locator('.preview-filename')).toHaveText('progress.txt')
  await page.locator('.preview-item').hover()
  await page.locator('.remove-btn').click()
  await expect(page.locator('.preview-item')).toHaveCount(0)
  await fillProgress(page)
  await page.getByRole('button', { name: 'Save Progress', exact: true }).click()
  await expect(page).toHaveURL(/progress\/update$/)
  await expect(page.locator('.op-form .op-error[role=alert]')).toBeVisible()
  expect(requests.some((r) => r.startsWith('progress-'))).toBe(false)
})
test('direct routes, RTL and responsive layouts', async ({ page }) => {
  await fixtures(page, { locale: 'ar' })
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/organization/objectives/481/details')
    await expect(page.locator('.op-facts')).toContainText('Safety')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('.op-page')).toContainText('سجل التقدم')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
      true,
    )
    await page.screenshot({ path: `/tmp/objectives-details-ar-${width}.png` })
  }
  await page.goto('/organization/objectives/481/progress/update')
  await expect(page.locator('#objective-reporting-period')).toBeVisible()
  await page.reload()
  await expect(page.locator('#objective-actual-result')).toBeVisible()
  await page.screenshot({ path: '/tmp/objectives-update-ar-390.png' })
})
test('invalid identifiers and missing objectives have recoverable states', async ({ page }) => {
  const { requests } = await fixtures(page, { failDetails: true })
  await page.goto('/organization/objectives/bad/details')
  await expect(page.locator('.op-page')).toContainText('Invalid objective identifier.')
  expect(requests.includes('fetch_objectives_details')).toBe(false)
  await page.goto('/organization/objectives/481/details')
  await expect(page.locator('.op-page [role=alert]')).toContainText('Unable to load')
  await expect(page.getByRole('button', { name: 'Retry', exact: true })).toBeVisible()
})
test('direct details and update respect objective permissions', async ({ page }) => {
  const { requests } = await fixtures(page, { permitted: false })
  await page.goto('/organization/objectives/481/details')
  await expect(page.locator('.op-page')).toContainText('You do not have permission')
  expect(requests.includes('fetch_objectives_details')).toBe(false)
})
async function fillProgress(page: Page) {
  await page.locator('#objective-reporting-period').click()
  await page.getByRole('option', { name: 'January 2026', exact: true }).click()
  await page.locator('#objective-actual-result').fill('64')
  await page.locator('#objective-progress-notes').fill('Verified result')
}
test('fixture contract save returns to fresh history and indicator; correction preserves record id', async ({
  page,
}) => {
  const { requests } = await fixtures(page, { connected: true })
  await page.goto('/organization/objectives/481/progress/update')
  await fillProgress(page)
  await page.getByRole('button', { name: 'Save Progress', exact: true }).click()
  await expect(page).toHaveURL(/481\/details$/)
  await expect(page.locator('.op-indicator strong')).toHaveText('80%')
  await expect(page.locator('.op-table')).toContainText('Verified result')
  expect(requests.filter((r) => r === 'progress-index').length).toBeGreaterThanOrEqual(2)
  await page.getByRole('link', { name: 'Correct Progress', exact: true }).click()
  await expect(page.locator('#objective-actual-result')).toHaveValue('64')
  await page.locator('#objective-actual-result').fill('72')
  await page.getByRole('button', { name: 'Save Progress', exact: true }).click()
  await expect(page).toHaveURL(/481\/details$/)
  await expect(page.locator('.op-indicator strong')).toHaveText('90%')
  expect(requests).toContain('progress-edit')
  await page.screenshot({ path: '/tmp/objectives-details-en-1440.png' })
  await page.getByRole('link', { name: 'Back', exact: true }).click()
  await expect(page).toHaveURL(/organization\/objectives$/)
  await expect(page.locator('.op-indicator strong')).toHaveText('90%')
  await page.setViewportSize({ width: 390, height: 1000 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
    true,
  )
  await page.screenshot({ path: '/tmp/objectives-index-en-390.png' })
})
test('API save failure keeps input and does not navigate or invent history', async ({ page }) => {
  const { history } = await fixtures(page, { connected: true, failSave: true })
  await page.goto('/organization/objectives/481/progress/update')
  await fillProgress(page)
  await page.getByRole('button', { name: 'Save Progress', exact: true }).click()
  await expect(page.locator('.op-form [role=alert]')).toContainText('Server rejected')
  await expect(page.locator('#objective-actual-result')).toHaveValue('64')
  await expect(page).toHaveURL(/progress\/update$/)
  expect(history).toHaveLength(0)
})

test('history service failure offers retry and blocks writes', async ({ page }) => {
  await fixtures(page, { connected: true, failHistory: true })
  await page.goto('/organization/objectives/481/details')
  await expect(page.locator('.op-page')).toContainText('Could not load progress history')
  await page.getByRole('link', { name: 'Update Progress', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Save Progress', exact: true })).toBeDisabled()
  await expect(page.locator('.op-form')).toContainText(
    'Load the progress history before submitting',
  )
})
