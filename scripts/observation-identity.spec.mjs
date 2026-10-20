import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import {
  installFixtures,
  project,
} from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const images = '/tmp/hse-observation-identity'
mkdirSync(images, { recursive: true })
const media = [
  {
    id: 1,
    url:
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180"><rect width="300" height="180" fill="#246bfe"/><circle cx="150" cy="90" r="40" fill="#ffffff"/></svg>',
      ),
  },
]
const person = { id: 1, name: 'Site employee', hierarchies: [], hierarchy: [], image: null }
const entry = {
  id: 101,
  type: 2,
  title: 'Workplace safety report',
  type_model: { id: 4, title: 'Equipment safety' },
  description:
    'Review the machine guard before continuing work. The report retains its original description and supporting evidence.',
  observer: person,
  creator: person,
  project,
  zoon: { id: 7, title: 'North zone' },
  equipment: { id: 1, title: 'Site machine' },
  media,
  updated_at: '2026-10-20T10:30:00Z',
  created_at: '2026-10-20T10:30:00Z',
  serial_name: 'OBS-101',
  date: '2026-10-20',
  time: '10:30',
  risk_level: 3,
  save_status: 2,
  action_status: 1,
  is_work_stopped: 1,
  investigation_status: 1,
  injuries: [],
  witness_statements: [],
  deaths: [],
  root_causes: [],
  like_lihood: 2,
  severity: 2,
  hazard_type: { id: 1, title: 'Mechanical' },
}
const casePerson = {
  id: 1,
  note: 'Reported by the site team.',
  organization_employee: person,
  media: [],
  ppeItems: [],
  injury_type: { id: 1, title: 'Hand injury' },
}

async function setup(page, locale = 'en', options = {}) {
  await installFixtures(page, { locale })
  const control = { state: 'success' }
  const requests = []
  for (const endpoint of [
    'fetch_observations',
    'fetch_observation_details',
    'fetch_my_projects',
    'fetch_my_zoons',
  ]) {
    await page.route(`**/${endpoint}`, async (route) => {
      requests.push({ endpoint, raw: route.request().postData() })
      if (control.state === 'failed' && endpoint === 'fetch_observations')
        return route.fulfill({ status: 500, json: { message: 'Test unavailable' } })
      let data
      if (endpoint === 'fetch_my_projects') data = [{ ...project, id: 433, title: 'North project' }]
      if (endpoint === 'fetch_my_zoons')
        data = {
          data: [{ project_zoon_id: 7, zoon_id: 7, zoon_title: 'North zone' }],
          meta: { total: 1 },
        }
      if (endpoint === 'fetch_observations') {
        const type = page.url().includes('incedant') ? 3 : 2
        data = {
          data:
            control.state === 'empty'
              ? []
              : [
                  { ...entry, type },
                  { ...entry, type, id: 102, media: [], is_work_stopped: 0, risk_level: 1 },
                ],
          meta: { current_page: 1, last_page: 2, per_page: 10, total: 12 },
        }
      }
      if (endpoint === 'fetch_observation_details')
        data = {
          ...entry,
          type: 3,
          injuries: [casePerson],
          witness_statements: [casePerson],
          deaths: [casePerson],
          ...options.details,
        }
      await route.fulfill({ json: { data, message: 'OK', status: true } })
    })
  }
  return { control, requests }
}

for (const locale of ['en', 'ar']) {
  test(`record lists and details identity: ${locale}`, async ({ page }) => {
    page.setDefaultTimeout(15000)
    await setup(page, locale)
    for (const [name, path, card] of [
      ['incidents', '/organization/equipment-mangement/incedant', '.incident-card'],
      [
        'observations',
        '/organization/equipment-mangement/observation',
        '.index-table-card.observation-card',
      ],
    ]) {
      await page.goto(baseURL + path, { waitUntil: 'domcontentloaded' })
      await expect(page.locator(card)).toHaveCount(2)
      await expect(page.locator(card).first()).toHaveCSS('background-image', 'none')
      await expect(page.locator(card).first().locator('h3')).toHaveCSS(
        'font-family',
        locale === 'ar' ? /HSE Arabic/ : /HSE Inter/,
      )
      await expect(page.locator('.categories-container .category')).toHaveCount(1)
      await expect(page.locator('.categories-container .category')).toHaveClass(/active/)
      await expect(page.locator('.filter.active')).toHaveText('North zone')
      for (const width of [1440, 768, 390]) {
        await page.setViewportSize({ width, height: 1000 })
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true)
        const filterHeights = await page.locator('.category.active').evaluate((button) => ({
          button: button.getBoundingClientRect().height,
          row: button.parentElement.getBoundingClientRect().height,
        }))
        expect(filterHeights.row).toBeGreaterThanOrEqual(filterHeights.button)
        await page.screenshot({ path: `${images}/${name}-${locale}-${width}.png`, fullPage: true })
      }
      await page.locator(`${card} .p-image`).first().click()
      await expect(page.locator('.p-image-mask')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.locator('.p-image-mask')).not.toBeVisible()
      await page.locator(`${card} [class^="view-"]`).first().click()
      await expect(page.locator('.record-details-page .observation-details-card')).toBeVisible()
    }
    await page.goto(`${baseURL}/organization/equipment-mangement/observation/show/101`, {
      waitUntil: 'domcontentloaded',
    })
    await expect(page.locator('.record-details-heading')).toContainText('OBS-101')
    await expect(page.locator('.all_injured')).toHaveCount(1)
    await expect(page.locator('.witnessStatement')).toHaveCount(1)
    await expect(page.locator('.death_all_card')).toHaveCount(1)
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
      await page.screenshot({ path: `${images}/details-${locale}-${width}.png`, fullPage: true })
    }
  })
}

test('record cards inherit saved identity colors and typography', async ({ page }) => {
  await setup(page)
  await page.addInitScript(() =>
    localStorage.setItem(
      'hse-system-identity',
      JSON.stringify({
        isActive: true,
        primaryColor: '#7254a3',
        appearance: {
          colors: {
            sectionBackground: '#edf1f5',
            sectionText: '#243649',
            tagBackground: '#17324b',
            tagText: '#ffffff',
            primaryButtonBackground: '#7254a3',
          },
          typography: { fontFamily: 'Cairo', fontSize: 16, headingSize: 30 },
        },
      }),
    ),
  )
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  )
  for (const [path, card] of [
    ['/organization/equipment-mangement/incedant', '.incident-card'],
    ['/organization/equipment-mangement/observation', '.index-table-card.observation-card'],
    ['/organization/equipment-mangement/observation/show/101', '.observation-details-card'],
  ]) {
    await page.goto(baseURL + path, { waitUntil: 'domcontentloaded' })
    await expect(page.locator(card).first()).toHaveCSS('background-color', 'rgb(237, 241, 245)')
    await expect(page.locator(card).first()).toHaveCSS('font-family', /Cairo/)
    if (card !== '.observation-details-card') {
      await expect(page.locator('.investigation-status-badge').first()).toHaveCSS(
        'background-color',
        'rgb(23, 50, 75)',
      )
      await expect(page.locator('.investigation-status-badge').first()).toHaveCSS(
        'color',
        'rgb(255, 255, 255)',
      )
    }
  }
})

test('empty and failed lists keep their actions and the identity frame', async ({ page }) => {
  const { control } = await setup(page)
  for (const path of [
    '/organization/equipment-mangement/incedant',
    '/organization/equipment-mangement/observation',
  ]) {
    for (const state of ['empty', 'failed']) {
      control.state = state
      await page.goto(baseURL + path, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('.hse-observation-identity .hse-operations-command')).toBeVisible()
      await expect(page.locator('.hse-observation-identity .data-state-card').first()).toBeVisible()
    }
  }
})

test('detail loading skeleton follows the saved section surface', async ({ page }) => {
  await setup(page)
  await page.addInitScript(() =>
    localStorage.setItem(
      'hse-system-identity',
      JSON.stringify({
        appearance: { colors: { sectionBackground: '#edf1f5' } },
      }),
    ),
  )
  let release
  const gate = new Promise((resolve) => {
    release = resolve
  })
  await page.route('**/fetch_observation_details', async (route) => {
    await gate
    await route.fallback()
  })
  await page.setViewportSize({ width: 390, height: 950 })
  await page.goto(`${baseURL}/organization/equipment-mangement/observation/show/101`, {
    waitUntil: 'domcontentloaded',
  })
  await expect(page.locator('.show-observation-skeleton')).toBeVisible()
  await expect(page.locator('.show-observation-skeleton .skeleton-card').first()).toHaveCSS(
    'background-color',
    'rgb(237, 241, 245)',
  )
  await page.screenshot({ path: `${images}/details-loading-390.png`, fullPage: true })
  release()
  await expect(page.locator('.observation-details-card')).toBeVisible()
})
