import { test, expect as baseExpect } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import {
  installFixtures,
  project,
} from '../src/features/Organization/Project/tests/project-fixtures.mjs'
const expect = baseExpect.configure({ timeout: 20_000 })
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const screenshots = '/tmp/hse-home-redesign'
mkdirSync(screenshots, { recursive: true })
const home = {
  total_incidents: 7,
  total_inspection: 60,
  inspection_compliance_percentage: 84,
  open_corrective_actions: 12,
  hazard_observations_high: 4,
  total_inspection_supposed_occured_this_month: 50,
  total_finished_inspections_results: 42,
  most_used_root_causes: [
    { root_cause_id: 8, root_cause_title: 'Procedure not followed', count: 9 },
    { root_cause_id: 9, root_cause_title: 'Missing safeguards', count: 5 },
  ],
  inspection_status: { new: 5, in_progress: 8, completed: 42, canceled: 0, delayed: 3 },
  employee_certificates_status: { total: 100, active: 90, expired: 4, inactive: 6 },
  hazard_with_high_risk_observations: [],
}
const equipment = {
  rent_and_owned_equipments: { owned: 80, rent: 20 },
  equipment_types_and_equipments_and_zones: [
    {
      title: 'North zone',
      total_equipments: 60,
      equipment_types: [
        { type: 1, count: 40 },
        { type: 2, count: 15 },
        { type: 3, count: 5 },
      ],
    },
    {
      title: 'South zone',
      total_equipments: 40,
      equipment_types: [
        { type: 1, count: 25 },
        { type: 2, count: 10 },
        { type: 3, count: 5 },
      ],
    },
  ],
}
const hazards = [
  {
    zone_id: 1,
    zone_title: 'North zone',
    all_observations: { hazard: 8, observation: 15, accidents: 2 },
  },
  {
    zone_id: 2,
    zone_title: 'South zone',
    all_observations: { hazard: 4, observation: 11, accidents: 1 },
  },
]
const endpoints = {
  home: 'fetch_home_inspection_and_observations_statices',
  equipment: 'fetch_home_equipments_statices',
  hazards: 'fetch_home_observation_types_with_zones_statices',
  investigations: 'fetch_home_observations_investigations_statices',
}
async function fixtures(
  page,
  { locale = 'en', empty = false, failedEquipment = false, delayProjects = false } = {},
) {
  const requests = await installFixtures(page, { locale })
  const counts = {}
  await page.addInitScript(() => localStorage.setItem('visited', 'true'))
  const reply = (endpoint, data, status = 200) =>
    page.route(`**/${endpoint}`, async (route) => {
      counts[endpoint] = (counts[endpoint] ?? 0) + 1
      await route.fulfill({
        status,
        json: { status: status === 200, message: status === 200 ? 'OK' : 'Unavailable', data },
      })
    })
  await reply('fetch_organization_app_status_details', { progress: 100, progress_items: [] })
  await reply(
    endpoints.home,
    empty
      ? {
          ...home,
          total_incidents: 0,
          inspection_compliance_percentage: null,
          most_used_root_causes: [],
        }
      : home,
  )
  await reply(
    endpoints.equipment,
    empty
      ? {
          rent_and_owned_equipments: { rent: 0, owned: 0 },
          equipment_types_and_equipments_and_zones: [],
        }
      : equipment,
    failedEquipment ? 500 : 200,
  )
  await reply(endpoints.hazards, empty ? [] : hazards)
  await reply(
    endpoints.investigations,
    empty
      ? []
      : [
          { zone_id: 1, zone_title: 'North zone', total: 100 },
          { zone_id: 2, zone_title: 'South zone', total: 65 },
        ],
  )
  let releaseProjects
  const projectGate = new Promise((resolve) => {
    releaseProjects = resolve
  })
  await page.route('**/fetch_projects', async (route) => {
    counts.fetch_projects = (counts.fetch_projects ?? 0) + 1
    if (delayProjects) await projectGate
    const projects = empty
      ? []
      : [
          project,
          ...[434, 435, 436, 437].map((id, index) => ({
            ...project,
            id,
            title: [
              'West Site Project',
              'Equipment Renewal',
              'Coastal Development',
              'Distribution Hub',
            ][index],
            project_progress: [35, 100, 12, 75][index],
            status: [1, 2, 3, 1][index],
          })),
        ]
    await route.fulfill({
      json: {
        status: true,
        data: {
          data: projects,
          meta: {
            from: 1,
            to: projects.length,
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: projects.length,
          },
        },
      },
    })
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  return { counts, requests, releaseProjects }
}
for (const locale of ['en', 'ar']) {
  test(`modern home data, responsive cards, and interactions: ${locale}`, async ({ page }) => {
    const { counts } = await fixtures(page, { locale })
    const localized = await page.evaluate(
      (locale) =>
        Object.fromEntries(
          [84, 100, 41, 29].map((value) => [value, new Intl.NumberFormat(locale).format(value)]),
        ),
      locale,
    )
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${baseURL}/organization`)
    await expect(page.locator('.dashboard-kpi').nth(2).locator('.dashboard-kpi__value')).toHaveText(
      `${localized[84]}%`,
    )
    await expect(page.locator('.dashboard-donut strong')).toHaveText(localized[100])
    await expect(
      page.locator('.dashboard-observation-chart .dashboard-chart-summary strong'),
    ).toHaveText(localized[41])
    const categories = page.locator('.dashboard-legend--interactive button')
    await categories.nth(0).click()
    await expect(categories.nth(0)).toHaveAttribute('aria-pressed', 'false')
    await expect(
      page.locator('.dashboard-observation-chart .dashboard-chart-summary strong'),
    ).toHaveText(localized[29])
    await categories.nth(0).click()
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect(page.locator('.dashboard-kpi')).toHaveCount(4)
      expect(
        await page
          .locator('.hse-home-dashboard')
          .evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
        `${locale} ${width}: dashboard overflow`,
      ).toBe(true)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
        `${locale} ${width}: page overflow`,
      ).toBe(true)
      if ([1440, 390].includes(width))
        await page.screenshot({
          path: `${screenshots}/home-${locale}-${width}.png`,
          fullPage: true,
        })
    }
    await page.setViewportSize({ width: 1440, height: 1000 })
    const next = page.locator('.dashboard-carousel-controls button').last()
    await expect(next).toBeEnabled()
    await next.click()
    await expect(page.locator('.dashboard-carousel-controls button').first()).toBeEnabled()
    const before = counts[endpoints.home]
    await page.locator('.dashboard-refresh').click()
    await expect.poll(() => counts[endpoints.home]).toBe(before + 1)
    await expect(page.locator('.dashboard-refresh')).toBeEnabled()
    expect(errors).toEqual([])
    const projectLink = page
      .locator('.dashboard-project-slide:not([inert]) .dashboard-project-card')
      .first()
    const href = await projectLink.getAttribute('href')
    await projectLink.click()
    await expect(page).toHaveURL(`${baseURL}${href}`)
  })
}
test('slow projects do not block metrics or other charts', async ({ page }) => {
  const { releaseProjects } = await fixtures(page, { delayProjects: true })
  await page.goto(`${baseURL}/organization`, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.dashboard-portfolio .dashboard-panel__skeleton')).toBeVisible()
  await expect(page.locator('.dashboard-kpi__value').nth(2)).toHaveText('84%')
  await expect(page.locator('.dashboard-donut strong')).toHaveText('100')
  releaseProjects()
  await expect(page.locator('.dashboard-project-card').first()).toBeVisible()
})
test('empty and missing values remain honest and usable', async ({ page }) => {
  await fixtures(page, { empty: true })
  await page.goto(`${baseURL}/organization`)
  await expect(page.locator('.dashboard-kpi__value').nth(0)).toHaveText('0')
  await expect(page.locator('.dashboard-kpi__value').nth(2)).toHaveText('—')
  await expect(page.locator('.dashboard-portfolio')).toContainText('No projects to display')
  await expect(page.locator('.dashboard-observation-chart')).toContainText(
    'No observation data available',
  )
  await expect(page.locator('.dashboard-donut')).toHaveClass(/dashboard-donut--empty/)
  await expect(page.locator('.hse-home-dashboard')).not.toContainText('NaN')
  await page.screenshot({ path: `${screenshots}/empty.png`, fullPage: true })
})
test('failed equipment leaves the other dashboard data available', async ({ page }) => {
  await fixtures(page, { failedEquipment: true })
  await page.goto(`${baseURL}/organization`)
  await expect(page.locator('.dashboard-empty--error')).toHaveCount(2)
  await expect(page.locator('.dashboard-kpi__value').nth(2)).toHaveText('84%')
  await expect(page.locator('.dashboard-project-card').first()).toBeVisible()
})
test('dark mode and custom identity colors reach data visualizations', async ({ page }) => {
  await fixtures(page)
  await page.goto(`${baseURL}/organization`)
  await expect(page.locator('.dashboard-kpi__value').nth(2)).toHaveText('84%')
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--identity-primary', '#8b5cf6')
    document.documentElement.setAttribute('data-theme', 'dark')
  })
  await expect(page.locator('.dashboard-panel').first()).toHaveCSS(
    'background-color',
    'rgb(16, 35, 63)',
  )
  await expect(
    page.locator('.dashboard-observation-chart .dashboard-stacked-track > i').nth(1),
  ).toHaveCSS('background-color', 'rgb(139, 92, 246)')
  await expect(page.locator('.dashboard-status--success').first()).toHaveCSS(
    'color',
    'rgb(10, 167, 120)',
  )
  await expect(
    page.locator('.dashboard-kpi--danger .dashboard-kpi__icon .dashboard-icon'),
  ).toHaveCSS('color', 'rgb(225, 74, 87)')
  await page.screenshot({ path: `${screenshots}/home-dark.png`, fullPage: true })
})
