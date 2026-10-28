import { test, expect } from '@playwright/test'
import { chartStyles } from '../../src/features/SystemIdentity/dashboard.ts'
import { installDashboardFixtures } from './dashboard-fixtures.mjs'
import { useIdentityCodeFlag } from '../fixtures/system-identity-api-mode.mjs'
const base = process.env.DASHBOARD_TEST_URL || 'http://localhost:5173'
const navigate = async (page, path) => {
  await page.evaluate((path) => {
    void document.querySelector('#app').__vue_app__.config.globalProperties.$router.push(path)
  }, path)
  await expect(page).toHaveURL(base + path)
}
async function chartState(canvas) {
  return canvas.evaluate((el) => {
    let owner = el.__vueParentComponent
    while (owner && !owner.proxy?.getChart) owner = owner.parent
    const chart = owner?.proxy.getChart()
    if (!chart) return null
    return {
      labels: [...chart.data.labels],
      datasets: chart.data.datasets.map((dataset) => ({
        values: [...dataset.data],
        color: dataset.backgroundColor,
        border: dataset.borderColor,
      })),
      legend: chart.legend.legendItems.map((item) => ({ text: item.text, color: item.fillStyle })),
    }
  })
}
test('exact single-zone payload produces two correctly colored series in every safety chart style', async ({
  page,
}) => {
  test.setTimeout(180000)
  await installDashboardFixtures(page)
  await useIdentityCodeFlag(page, false)
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('safety-merge-started')) {
      localStorage.removeItem('hse-system-identity')
      sessionStorage.setItem('safety-merge-started', 'true')
    }
  })
  await page.route('**/organization/fetch_home_observation_types_with_zones_statices', (route) =>
    route.fulfill({
      json: {
        status: true,
        data: [
          {
            zone_id: 10,
            zone_title: 'dsadas',
            all_observations: { hazard: 4, accidents: 7, observation: 0 },
          },
        ],
      },
    }),
  )
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(base + '/organization')
  const native = page.getByTestId('safety-panel').locator('.command-category-chart')
  await expect(native.locator('.command-legend li')).toHaveText(['Incidents', 'Observations'])
  await native.locator('.command-chart-table summary').click()
  await expect(native.locator('tbody td')).toHaveText(['7', '4'])
  await expect(native.locator('tbody th')).toHaveText('dsadas')
  await navigate(page, '/organization/system-identity')
  await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  const editor = page.locator('.dashboard-editor')
  await editor.getByLabel('Chart palette').selectOption('custom')
  await editor.getByLabel('Chart color 1', { exact: true }).fill('#ee1122')
  await editor.getByLabel('Chart color 2', { exact: true }).fill('#1166ee')
  for (const style of chartStyles) {
    await editor.getByLabel('Chart style', { exact: true }).selectOption(style)
    await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
    await expect(page.getByRole('status')).toContainText('System identity has been saved')
    await navigate(page, '/organization')
    const canvas = page.getByTestId('safety-panel').locator('.dashboard-custom-chart canvas')
    const circular = ['pie', 'doughnut', 'polarArea', 'semiDoughnut'].includes(style)
    await expect
      .poll(
        async () => (await chartState(canvas))?.datasets.map((dataset) => dataset.values),
        style,
      )
      .toEqual(circular ? [[7, 4]] : style === 'mixed' ? [[7], [7], [4], [4]] : [[7], [4]])
    const state = await chartState(canvas)
    if (circular) {
      expect(state.labels).toEqual(['Incidents', 'Observations'])
      expect(state.datasets[0].color).toEqual(['#ee1122', '#1166ee'])
      expect(state.legend.map((item) => item.color)).toEqual(['#ee1122', '#1166ee'])
    } else {
      expect(state.labels).toEqual(['dsadas'])
      expect(state.datasets[0].border).toBe('#ee1122')
      expect(state.datasets[style === 'mixed' ? 2 : 1].border).toBe('#1166ee')
    }
    await navigate(page, '/organization/system-identity')
    await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  }
  await navigate(page, '/organization')
  await page.reload()
  const canvas = page.getByTestId('safety-panel').locator('.dashboard-custom-chart canvas')
  await expect
    .poll(async () => (await chartState(canvas))?.datasets.map((dataset) => dataset.values))
    .toEqual([[7], [7], [4], [4]])
  expect(errors).toEqual([])
})
