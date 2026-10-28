import { test, expect } from '@playwright/test'
import { chartStyles } from '../../src/features/SystemIdentity/dashboard.ts'
import { installDashboardFixtures } from './dashboard-fixtures.mjs'
import { useIdentityCodeFlag } from '../fixtures/system-identity-api-mode.mjs'
test.describe.configure({ mode: 'parallel' })
const base = process.env.DASHBOARD_TEST_URL || 'http://localhost:5173'
const navigate = (page, path) =>
  page.evaluate(
    (path) => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push(path),
    path,
  )
async function local(page, locale = 'en') {
  await installDashboardFixtures(page, { locale })
  await useIdentityCodeFlag(page, false)
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('chart-style-test')) {
      localStorage.removeItem('hse-system-identity')
      sessionStorage.setItem('chart-style-test', 'true')
    }
  })
  const identityRequests = []
  await page.route('**/organization/*system_identity', (route) => {
    identityRequests.push(route.request().url())
    return route.abort()
  })
  return identityRequests
}
async function snapshot(canvas) {
  return canvas.evaluate((el) => {
    let owner = el.__vueParentComponent
    while (owner && !owner.proxy?.getChart) owner = owner.parent
    const chart = owner?.proxy.getChart()
    if (!chart || !chart.width || !chart.height) return null
    return {
      type: chart.config.type,
      datasets: chart.data.datasets.map((d, index) => ({
        type: d.type ?? chart.config.type,
        data: [...d.data],
        fill: d.fill,
        tension: d.tension,
        stepped: d.stepped,
        borderDash: d.borderDash,
        showLine: d.showLine,
        borderRadius: d.borderRadius,
        pointRadius: d.pointRadius,
        drawn: chart
          .getDatasetMeta(index)
          .data.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)),
      })),
      horizontal: chart.options.indexAxis === 'y',
      stacked: chart.options.scales?.y?.stacked ?? false,
      circumference: chart.options.circumference,
      rotation: chart.options.rotation,
      legend: chart.options.plugins.legend.display,
      grid: chart.options.scales?.y?.grid?.display,
    }
  })
}
async function readyChart(canvas) {
  await expect(canvas).toBeVisible()
  await expect.poll(() => snapshot(canvas)).not.toBeNull()
  const result = await snapshot(canvas)
  expect(result.datasets.every((d) => d.drawn)).toBe(true)
  return result
}
function checkStyle(chart, style) {
  if (['horizontalBar', 'horizontalStackedBar'].includes(style)) expect(chart.horizontal).toBe(true)
  if (['stackedBar', 'horizontalStackedBar', 'stackedArea'].includes(style))
    expect(chart.stacked).toBe(true)
  if (style === 'roundedBar') expect(chart.datasets[0].borderRadius).toBe(999)
  if (style === 'straightLine') expect(chart.datasets[0].tension).toBe(0)
  if (style === 'steppedLine') expect(chart.datasets[0].stepped).toBe(true)
  if (style === 'dashedLine') expect(chart.datasets[0].borderDash).toEqual([8, 5])
  if (style === 'points') {
    expect(chart.datasets[0].showLine).toBe(false)
    expect(chart.datasets[0].pointRadius).toBe(5)
  }
  if (['area', 'stackedArea', 'radar'].includes(style)) expect(chart.datasets[0].fill).toBe(true)
  if (style === 'radarOutline') {
    expect(chart.type).toBe('radar')
    expect(chart.datasets[0].fill).toBe(false)
  }
  if (style === 'semiDoughnut') {
    expect(chart.type).toBe('doughnut')
    expect(chart.circumference).toBe(180)
    expect(chart.rotation).toBe(-90)
  }
  if (style === 'mixed')
    expect(chart.datasets.map((d) => d.type)).toEqual(['bar', 'line', 'bar', 'line'])
}
for (const style of chartStyles.filter((style) => style !== 'default')) {
  test(`${style}: preview, local save, Home rendering and reload preserve real counts`, async ({
    page,
  }) => {
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    const requests = await local(page)
    await page.goto(base + '/organization/system-identity')
    await page.getByRole('tab', { name: 'Home charts and layout' }).click()
    const editor = page.locator('.dashboard-editor')
    await editor.getByLabel('Chart style', { exact: true }).selectOption(style)
    const preview = await readyChart(editor.locator('canvas'))
    checkStyle(preview, style === 'mixed' ? 'bar' : style)
    await editor.getByLabel('Chart', { exact: true }).selectOption('equipment')
    await editor.getByLabel('Chart style', { exact: true }).selectOption(style)
    await readyChart(editor.locator('canvas'))
    await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
    await expect(page.getByRole('status')).toContainText('System identity has been saved')
    await navigate(page, '/organization')
    const safetyCanvas = page.getByTestId('safety-panel').locator('.dashboard-custom-chart canvas')
    const safety = await readyChart(safetyCanvas)
    if (['pie', 'doughnut', 'polarArea', 'semiDoughnut'].includes(style)) {
      expect(safety.datasets.map((dataset) => dataset.data)).toEqual([
        [2, 18],
        [3, 20],
        [4, 22],
      ])
    } else {
      expect(safety.datasets[0].data).toEqual([2, 3, 4])
      expect(safety.datasets[style === 'mixed' ? 2 : 1].data).toEqual([18, 20, 22])
    }
    checkStyle(safety, style)
    const equipment = await readyChart(page.getByTestId('equipment-panel').locator('canvas'))
    expect(equipment.datasets[0].data).toEqual([82, 18])
    await page.reload()
    await readyChart(page.getByTestId('equipment-panel').locator('canvas'))
    await expect(
      page.getByTestId('safety-panel').locator('.dashboard-custom-chart'),
    ).toHaveAttribute('data-chart-style', style)
    if (style === 'mixed' || style === 'semiDoughnut') {
      await page.screenshot({ path: `/tmp/hse-chart-${style}-home.png`, fullPage: true })
      await page.setViewportSize({ width: 375, height: 900 })
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
      ).toBe(true)
    }
    expect(requests).toEqual([])
    expect(errors).toEqual([])
  })
}
test('other Home charts render their individual choices and Arabic labels after reload', async ({
  page,
}) => {
  await local(page)
  await page.goto(base + '/organization/system-identity')
  await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  const editor = page.locator('.dashboard-editor')
  for (const [id, style] of [
    ['inspection', 'steppedLine'],
    ['workforce', 'roundedBar'],
    ['cases', 'points'],
    ['equipmentLocations', 'horizontalStackedBar'],
  ]) {
    await editor.getByLabel('Chart', { exact: true }).selectOption(id)
    await editor.getByLabel('Chart style', { exact: true }).selectOption(style)
    await editor.getByLabel('Show legend').uncheck()
    await editor.getByLabel('Show grid').uncheck()
  }
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('System identity has been saved')
  await navigate(page, '/organization')
  await page.reload()
  for (const [panel, values] of [
    ['inspection-panel', [12, 21, 33, 4, 2]],
    ['workforce-panel', [124, 20, 16]],
    ['cases-panel', [4]],
  ]) {
    const chart = await readyChart(
      page.getByTestId(panel).locator('.dashboard-custom-chart canvas'),
    )
    expect(chart.datasets[0].data).toEqual(values)
    expect(chart.legend).toBe(false)
    expect(chart.grid).toBe(false)
  }
  await page.getByTestId('equipment-panel').locator('.command-equipment-detail > summary').click()
  const locations = await readyChart(
    page.getByTestId('equipment-panel').locator('.dashboard-custom-chart canvas'),
  )
  expect(locations.horizontal).toBe(true)
  expect(locations.stacked).toBe(true)
  await page.evaluate(() => {
    document.querySelector('#app').__vue_app__.config.globalProperties.$i18n.locale = 'ar'
  })
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await navigate(page, '/organization/system-identity')
  await page.getByRole('tab', { name: 'رسوم الصفحة الرئيسية وتخطيطها' }).click()
  await expect(
    editor.getByLabel('نمط الرسم البياني').locator('option[value="semiDoughnut"]'),
  ).toHaveText('حلقي نصف دائري')
  await page.screenshot({ path: '/tmp/hse-more-chart-options-ar.png', fullPage: true })
})
