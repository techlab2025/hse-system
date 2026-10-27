import { test, expect } from '@playwright/test'
import { installDashboardFixtures } from './dashboard-fixtures.mjs'
const base = process.env.DASHBOARD_TEST_URL || 'http://127.0.0.1:5184'
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base))
  throw new Error('Dashboard fixture tests require a local server.')
const root = (page) => page.getByTestId('organization-command-center')
const ready = async (page) => {
  await expect(root(page)).toBeVisible()
  await expect(root(page).locator('[aria-busy="true"]')).toHaveCount(0)
}
const selectProject = (page, id) =>
  page.evaluate((id) => {
    const store = document
      .querySelector('#app')
      .__vue_app__.config.globalProperties.$pinia._s.get('ProjectSelect')
    store.setProjectId(id ? { id, title: `Project ${id}` } : null)
  }, id)
const language = (page, value) =>
  page.evaluate((value) => {
    document.querySelector('#app').__vue_app__.config.globalProperties.$i18n.locale = value
  }, value)

for (const locale of ['en', 'ar']) {
  test(`${locale}: responsive dashboard at all six required widths`, async ({ page }) => {
    const controls = await installDashboardFixtures(page, { locale })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(base + '/organization')
    await ready(page)
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1100 })
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
        `Page overflow at ${width}`,
      ).toBe(true)
      const cards = await root(page).locator('.command-metric').first().boundingBox()
      expect(cards.width).toBeGreaterThan(90)
      await expect(root(page).locator('h1')).toBeVisible()
    }
    for (const key of ['summary', 'equipment', 'safety', 'projects'])
      expect(controls.requests.filter((r) => r.key === key)).toHaveLength(1)
    expect(errors).toEqual([])
  })
}
test('metrics use real counts, inspection counts are not percentages and projects are compact links', async ({
  page,
}) => {
  await installDashboardFixtures(page)
  await page.goto(base + '/organization')
  await ready(page)
  await expect(page.getByTestId('metric-incidents').locator('.command-metric-value')).toHaveText(
    '27',
  )
  await expect(page.getByTestId('metric-risk').locator('.command-metric-value')).toHaveText('7')
  await expect(page.getByTestId('metric-inspections').locator('.command-metric-value')).toHaveText(
    '4',
  )
  await expect(page.getByTestId('metric-corrective').locator('.command-metric-value')).toHaveText(
    '9',
  )
  await expect(page.getByTestId('inspection-panel')).toContainText('54')
  await expect(page.getByTestId('inspection-panel')).not.toContainText('54%')
  await expect(page.getByTestId('projects-panel').locator('tbody tr')).toHaveCount(5)
  await expect(
    page.getByTestId('projects-panel').getByRole('link', { name: 'Project 1', exact: true }),
  ).toHaveAttribute('href', '/organization/project-summary/1')
  await expect(root(page)).not.toContainText('99%')
  await expect(root(page)).not.toContainText('most used equipment')
})
test('language changes localize all dashboard labels without refetching or translating user data', async ({
  page,
}) => {
  const controls = await installDashboardFixtures(page)
  await page.goto(base + '/organization')
  await ready(page)
  const total = controls.requests.length
  await language(page, 'ar')
  await expect(root(page).locator('h1')).toHaveText('مؤشرات السلامة')
  await expect(page.getByTestId('safety-panel')).toContainText('Open location 1')
  await expect(page.getByTestId('projects-panel')).toContainText('المشروع 1')
  await language(page, 'en')
  await expect(root(page).locator('h1')).toHaveText('Safety intelligence')
  expect(controls.requests.length).toBe(total)
})
test('partial API failure does not become a zero and retry only reloads that source', async ({
  page,
}) => {
  const controls = await installDashboardFixtures(page, { mode: 'error' })
  await page.goto(base + '/organization')
  await ready(page)
  await expect(page.getByTestId('metric-incidents').locator('.command-metric-value')).toHaveText(
    '—',
  )
  await expect(page.getByTestId('attention-panel')).toContainText('could not be loaded')
  await expect(page.getByTestId('equipment-panel')).toContainText('82')
  controls.mode = 'populated'
  await page.getByTestId('attention-panel').getByRole('button', { name: 'Try again' }).click()
  await ready(page)
  await expect(page.getByTestId('metric-incidents').locator('.command-metric-value')).toHaveText(
    '27',
  )
  expect(controls.requests.filter((r) => r.key === 'summary')).toHaveLength(2)
  expect(controls.requests.filter((r) => r.key === 'equipment')).toHaveLength(1)
})
test('empty data and missing fields remain unknown without fabricated charts or compliance', async ({
  page,
}) => {
  const controls = await installDashboardFixtures(page, { mode: 'empty' })
  await page.goto(base + '/organization')
  await ready(page)
  await expect(page.getByTestId('metric-incidents').locator('.command-metric-value')).toHaveText(
    '—',
  )
  await expect(root(page).locator('.command-bar-track')).toHaveCount(0)
  controls.mode = 'partial'
  await root(page).getByRole('button', { name: 'Refresh', exact: true }).click()
  await ready(page)
  await expect(page.getByTestId('metric-incidents').locator('.command-metric-value')).toHaveText(
    '0',
  )
  await expect(page.getByTestId('metric-corrective').locator('.command-metric-value')).toHaveText(
    '—',
  )
  await expect(page.getByTestId('attention-panel')).toContainText(
    'Some review signals are unavailable',
  )
})
test('single-location grouped chart keeps a bounded plot and independent retry', async ({
  page,
}) => {
  const controls = await installDashboardFixtures(page, { size: 1 })
  await page.goto(base + '/organization')
  await ready(page)
  await expect(
    page.getByTestId('safety-panel').locator('.command-chart-table tbody tr'),
  ).toHaveCount(1)
  await expect(page.getByTestId('safety-panel').locator('canvas')).toBeVisible()
  expect((await page.getByTestId('safety-panel').locator('.command-grouped-canvas').boundingBox()).height).toBeLessThan(350)
  // Switch the response mode without using production sample data.
  controls.failures.add('safety')
  await root(page).getByRole('button', { name: 'Refresh', exact: true }).click()
  await ready(page)
  await expect(page.getByTestId('safety-panel')).toContainText('could not be loaded')
})
test('many locations use readable grouped chart pages without dropping records', async ({
  page,
}) => {
  await installDashboardFixtures(page, { size: 150 })
  await page.goto(base + '/organization')
  await ready(page)
  const chart = page.getByTestId('safety-panel')
  await expect(chart.locator('canvas')).toBeVisible()
  await expect(chart.locator('.command-chart-pagination')).toContainText('of 150')
  const first = await chart.locator('.command-chart-table tbody th').first().textContent()
  await chart
    .locator('.command-chart-pagination')
    .getByRole('button', { name: 'Next', exact: true })
    .click()
  await expect(chart.locator('.command-chart-table tbody th').first()).not.toHaveText(first)
  expect((await chart.locator('.command-grouped-canvas').boundingBox()).height).toBeLessThan(350)
})
test('project changes scope every request and stale responses cannot overwrite the current selection', async ({
  page,
}) => {
  const controls = await installDashboardFixtures(page)
  await page.goto(base + '/organization')
  await ready(page)
  let release
  // Delay only one source so every pending response can be released.
  controls.delay = async (key, body) => {
    if (key === 'summary' && body.project_id === 1)
      await new Promise((resolve) => {
        release = resolve
      })
  }
  await selectProject(page, 1)
  await expect.poll(() => controls.requests.filter((r) => r.body.project_id === 1).length).toBe(4)
  await selectProject(page, 2)
  await ready(page)
  await expect(page.getByTestId('metric-incidents').locator('.command-metric-value')).toHaveText(
    '2',
  )
  await expect(page.getByTestId('projects-panel').locator('tbody tr')).toHaveCount(1)
  release?.()
  await page.waitForTimeout(250)
  await expect(page.getByTestId('metric-incidents').locator('.command-metric-value')).toHaveText(
    '2',
  )
  for (const key of ['summary', 'equipment', 'safety', 'projects'])
    expect(controls.requests.filter((r) => r.key === key && r.body.project_id === 2)).toHaveLength(
      1,
    )
})
test('project pagination does not refetch independent analytics', async ({ page }) => {
  const controls = await installDashboardFixtures(page)
  await page.goto(base + '/organization')
  await ready(page)
  await page
    .getByTestId('projects-panel')
    .getByRole('button', { name: 'Next', exact: true })
    .click()
  await ready(page)
  await expect(page.getByTestId('projects-panel')).toContainText('Project 6')
  expect(controls.requests.filter((r) => r.key === 'projects')).toHaveLength(2)
  expect(controls.requests.filter((r) => r.key === 'summary')).toHaveLength(1)
})
test('restricted organization administrators do not fetch or display bundled unauthorized metrics', async ({
  page,
}) => {
  const controls = await installDashboardFixtures(page, { restricted: true })
  await page.goto(base + '/organization')
  await ready(page)
  expect(controls.requests).toEqual([])
  await expect(root(page)).toContainText('partial module access')
  await expect(page.getByTestId('metric-inspections').locator('.command-metric-value')).toHaveText(
    '—',
  )
  await expect(root(page).getByRole('link', { name: 'All projects', exact: true })).toHaveCount(0)
})

test('approved ownership donut uses actual counts and rates remain unavailable for incompatible cohorts', async ({
  page,
}) => {
  await installDashboardFixtures(page)
  await page.goto(base + '/organization')
  await ready(page)
  const ownership = page.getByTestId('equipment-panel')
  await expect(ownership.locator('.command-donut-center strong')).toHaveText('100')
  await expect(ownership.locator('.command-donut-legend')).toContainText('82%')
  await expect(ownership.locator('.command-donut-legend')).toContainText('18%')
  await expect(page.getByTestId('inspection-panel').locator('.command-donut')).toHaveCount(0)
  await expect(page.getByTestId('workforce-panel').locator('.command-donut')).toHaveCount(0)
  await expect(
    page.getByTestId('corrective-panel').locator('.command-open-counter strong'),
  ).toHaveText('9')
  await expect(page.getByTestId('corrective-panel')).not.toContainText('65%')
  await expect(page.getByTestId('cases-panel')).toContainText('Work planning')
  expect((await page.getByTestId('cases-panel').boundingBox()).height).toBeLessThan(260)
})
test('quick actions resolve to real routes and do not offer a nonexistent standalone CAPA create flow', async ({
  page,
}) => {
  await installDashboardFixtures(page)
  await page.goto(base + '/organization')
  await ready(page)
  const links = await page
    .getByTestId('quick-actions')
    .locator('a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  expect(links.length).toBe(4)
  const resolved = await page.evaluate((links) => {
    const router = document.querySelector('#app').__vue_app__.config.globalProperties.$router
    return links.map((link) => ({
      path: link,
      name: String(router.resolve(link).name),
      matched:
        router.resolve(link).matched.length > 0 &&
        !router.resolve(link).matched.at(-1).path.includes(':pathMatch'),
    }))
  }, links)
  expect(resolved.every((route) => route.matched)).toBe(true)
  expect(links).toContain('/organization/capa')
  await expect(page.getByTestId('activities-panel')).toContainText('Explore safety operations')
  await expect(page.getByTestId('activities-panel')).not.toContainText('hours ago')
})
test('creation-only permissions show only the authorized quick action, without fetching sensitive aggregates', async ({
  page,
}) => {
  const controls = await installDashboardFixtures(page, { restricted: true })
  await page.addInitScript(() => {
    const value = JSON.parse(localStorage.getItem('user'))
    value.user.permission = ['OOB03']
    localStorage.setItem('user', JSON.stringify(value))
  })
  await page.goto(base + '/organization')
  await ready(page)
  await expect(page.getByTestId('quick-actions').locator('a')).toHaveCount(1)
  await expect(
    page.getByTestId('quick-actions').getByRole('link', { name: 'Add observation', exact: true }),
  ).toBeVisible()
  expect(controls.requests).toEqual([])
})

test('corrected visual scale and categorical charts preserve meaningful desktop proportions', async ({
  page,
}) => {
  await installDashboardFixtures(page)
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.goto(base + '/organization')
  await ready(page)
  const styles = await root(page).evaluate((el) => {
    const size = (selector) => parseFloat(getComputedStyle(el.querySelector(selector)).fontSize)
    return {
      heading: size('h1'),
      title: size('.command-panel-head h2'),
      kpi: size('.command-metric-value'),
      body: size('.command-project-table tbody td'),
    }
  })
  expect(styles.heading).toBeGreaterThanOrEqual(24)
  expect(styles.title).toBeGreaterThanOrEqual(15)
  expect(styles.kpi).toBeGreaterThanOrEqual(32)
  expect(styles.body).toBeGreaterThanOrEqual(13)
  await expect(page.getByTestId('safety-panel').locator('canvas')).toBeVisible()
  await expect(
    page.getByTestId('safety-panel').locator('.command-chart-table thead th'),
  ).toHaveCount(4)
  await expect(root(page)).not.toContainText('Reported count')
  await expect(page.getByTestId('activities-panel')).not.toContainText('Recent activities')
  await expect(page.getByTestId('corrective-panel')).not.toContainText('Closed')
})

test('mobile closed drawer does not paint over the dashboard and project table stays readable', async ({
  page,
}) => {
  await installDashboardFixtures(page, { locale: 'ar' })
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto(base + '/organization')
  await ready(page)
  const drawer = page.locator('.sidebar-container')
  await expect(drawer).not.toHaveClass(/sidebar-open/)
  await expect(drawer).toHaveCSS('visibility', 'hidden')
  await expect(drawer).toHaveCSS('background-image', 'none')
  const table = page.getByTestId('projects-panel').locator('.command-table-wrap')
  expect(await table.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
  await expect(page.getByTestId('projects-panel').locator('tbody td').first()).toHaveCSS(
    'font-size',
    '14px',
  )
  // The dashboard-only override must release the actual drawer when opened.
  await drawer.evaluate((el) => el.classList.add('sidebar-open'))
  await expect(drawer).toHaveCSS('visibility', 'visible')
})

test('one location renders three exact semantic series and missing root causes reserve no section', async ({
  page,
}) => {
  await installDashboardFixtures(page, { size: 1, rootCauses: false })
  await page.goto(base + '/organization')
  await ready(page)
  await expect(page.getByTestId('cases-panel')).toHaveCount(0)
  const canvas = page.getByTestId('safety-panel').locator('canvas')
  await expect
    .poll(async () =>
      canvas.evaluate((el) => {
        const ctx = el.getContext('2d'),
          pixels = ctx.getImageData(0, 0, el.width, el.height).data
        const counts = [0, 0, 0],
          colors = [
            [240, 68, 82],
            [245, 158, 11],
            [40, 100, 240],
          ]
        for (let i = 0; i < pixels.length; i += 4)
          colors.forEach((c, j) => {
            if (
              pixels[i] === c[0] &&
              pixels[i + 1] === c[1] &&
              pixels[i + 2] === c[2] &&
              pixels[i + 3] === 255
            )
              counts[j]++
          })
        return counts.every((n) => n > 100)
      }),
    )
    .toBe(true)
  const rows = page.getByTestId('safety-panel').locator('.command-chart-table tbody tr')
  await expect(rows).toHaveCount(1)
  await expect(rows.first().locator('td')).toHaveText(['2', '4', '14'])
  await expect(page.getByTestId('safety-panel').locator('.command-bar-track')).toHaveCount(0)
})
