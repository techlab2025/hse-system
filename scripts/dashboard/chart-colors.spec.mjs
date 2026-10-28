import { test, expect } from '@playwright/test'
import { installDashboardFixtures } from './dashboard-fixtures.mjs'
import { useIdentityCodeFlag } from '../fixtures/system-identity-api-mode.mjs'
const base = process.env.DASHBOARD_TEST_URL || 'http://localhost:5173'
const navigate = (page, path) =>
  page.evaluate(
    (path) => document.querySelector('#app').__vue_app__.config.globalProperties.$router.push(path),
    path,
  )
async function colors(canvas) {
  return canvas.evaluate((el) => {
    let owner = el.__vueParentComponent
    while (owner && !owner.proxy?.getChart) owner = owner.parent
    const chart = owner?.proxy.getChart()
    if (!chart) return null
    return chart.data.datasets.map((dataset) => ({
      background: dataset.backgroundColor,
      border: dataset.borderColor,
      points: dataset.pointBackgroundColor,
    }))
  })
}
test('each chart saves independent colors and renders them on Home after reload', async ({
  page,
}) => {
  test.setTimeout(120000)
  await installDashboardFixtures(page)
  await useIdentityCodeFlag(page, false)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('colors-started')) {
      localStorage.removeItem('hse-system-identity')
      sessionStorage.setItem('colors-started', 'true')
    }
  })
  await page.goto(base + '/organization/system-identity')
  await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  const editor = page.locator('.dashboard-editor')
  const palettes = {
    safety: ['#aa1122', '#bb2233', '#cc3344'],
    equipment: ['#115599', '#22aa88'],
    inspection: ['#881122', '#993344'],
    workforce: ['#44aa22', '#55bb33'],
    cases: ['#9944aa', '#aa55bb'],
    equipmentLocations: ['#1155aa', '#2266bb', '#3377cc'],
  }
  for (const [id, palette] of Object.entries(palettes)) {
    await editor.getByLabel('Chart', { exact: true }).selectOption(id)
    await editor.getByLabel('Chart palette').selectOption('custom')
    for (const [index, color] of palette.entries()) {
      await editor.getByLabel(`Chart color ${index + 1}`, { exact: true }).fill(color)
    }
    await expect
      .poll(async () => (await colors(editor.locator('canvas')))?.[0]?.background)
      .not.toBeUndefined()
  }
  // Switching charts and presets retains this chart's own choices.
  await editor.getByLabel('Chart', { exact: true }).selectOption('equipment')
  await expect(editor.getByLabel('Chart color 1', { exact: true })).toHaveValue('#115599')
  await editor.getByLabel('Chart palette').selectOption('ocean')
  await editor.getByLabel('Chart palette').selectOption('custom')
  await expect(editor.getByLabel('Chart color 1', { exact: true })).toHaveValue('#115599')
  await editor.getByRole('button', { name: 'Add chart color', exact: true }).click()
  await expect(editor.getByLabel('Chart color 7', { exact: true })).toBeVisible()
  await editor.getByRole('button', { name: 'Remove last color', exact: true }).click()
  await expect(editor.getByLabel('Chart color 7', { exact: true })).toHaveCount(0)
  await expect
    .poll(async () => (await colors(editor.locator('canvas')))?.[0]?.background?.slice(0, 2))
    .toEqual(palettes.equipment)
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('System identity has been saved')
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hse-system-identity')))
  for (const [id, palette] of Object.entries(palettes))
    expect(saved.appearance.dashboard.charts[id].customColors.slice(0, palette.length)).toEqual(
      palette,
    )
  await navigate(page, '/organization')
  await page.reload()
  await expect
    .poll(async () =>
      (
        await colors(
          page.getByTestId('safety-panel').locator('.dashboard-custom-chart canvas').first(),
        )
      )?.map((dataset) => dataset.background),
    )
    .toEqual(palettes.safety.slice(0, 2))
  await expect
    .poll(async () =>
      (
        await colors(page.getByTestId('equipment-panel').locator('canvas').first())
      )?.[0]?.background?.slice(0, 2),
    )
    .toEqual(palettes.equipment)
  for (const [panel, id] of [
    ['inspection-panel', 'inspection'],
    ['workforce-panel', 'workforce'],
    ['cases-panel', 'cases'],
  ]) {
    await expect
      .poll(async () =>
        (
          await colors(page.getByTestId(panel).locator('.dashboard-custom-chart canvas'))
        )?.[0]?.background?.slice(0, id === 'cases' ? 1 : 2),
      )
      .toEqual(palettes[id].slice(0, id === 'cases' ? 1 : 2))
  }
  await page.getByTestId('equipment-panel').locator('.command-equipment-detail > summary').click()
  await expect
    .poll(async () =>
      (
        await colors(
          page.getByTestId('equipment-panel').locator('.command-equipment-detail canvas'),
        )
      )?.map((dataset) => dataset.background),
    )
    .toEqual(palettes.equipmentLocations)
  await page.screenshot({ path: '/tmp/hse-home-custom-chart-colors.png', fullPage: true })
  await navigate(page, '/organization/system-identity')
  await page.getByRole('tab', { name: 'Home charts and layout' }).click()
  await expect(editor.getByLabel('Chart color 1', { exact: true })).toHaveValue('#aa1122')
  await editor.getByRole('button', { name: 'Reset chart colors', exact: true }).click()
  await expect(editor.getByLabel('Chart color 1', { exact: true })).toHaveValue('#2864f0')
  await editor.getByLabel('Chart', { exact: true }).selectOption('equipment')
  await expect(editor.getByLabel('Chart color 1', { exact: true })).toHaveValue('#115599')
  await page.setViewportSize({ width: 375, height: 900 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
    true,
  )
  expect(errors).toEqual([])
})
