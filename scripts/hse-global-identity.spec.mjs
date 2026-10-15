import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5186'
const screenshots = '/tmp/hse-global-identity'
mkdirSync(screenshots, { recursive: true })

const routes = [
  ['dashboard', '/organization'],
  ['projects', '/organization/projects'],
  ['project-summary', '/organization/project-summary/433'],
  ['employees', '/organization/organization-employee'],
  ['locations', '/organization/organization-locations'],
  ['equipment', '/organization/equipments'],
  ['incidents', '/organization/equipment-mangement/incedant'],
  ['investigations', '/organization/Investigating'],
  ['inspections', '/organization/equipment-mangement/inspection'],
  ['reports', '/organization/corrective-report'],
  ['settings', '/organization/setting'],
]

test('login uses the global identity at desktop and mobile', async ({ page }) => {
  await page.goto(`${baseURL}/login/organization`)
  await expect(page.locator('html')).toHaveClass(/hse-cloud-identity/)
  await expect(page.locator('.login-form')).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 248, 252)')

  for (const width of [1920, 1440, 1280, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.locator('.login').evaluate((element) => element.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(900)
    await page.screenshot({ path: `${screenshots}/login-${width}.png`, fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
  }
})

test('representative feature routes inherit one global identity', async ({ page }) => {
  page.setDefaultTimeout(20_000)
  await installFixtures(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })

  for (const [name, path] of routes) {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('html')).toHaveClass(/hse-cloud-identity/)
    await expect(page.locator('.hse-app-header')).toBeVisible()
    await expect(page.locator('body')).toHaveCSS('font-family', /HSE Inter/)
    await expect(page.locator('.main-content')).toHaveCSS('background-color', 'rgb(245, 248, 252)')
    await page.screenshot({ path: `${screenshots}/${name}-1440.png`, fullPage: true })
  }

  for (const [name, path] of routes.slice(0, 5)) {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.hse-app-header')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
    await page.screenshot({ path: `${screenshots}/${name}-390.png`, fullPage: true })
  }

  for (const width of [1920, 1280, 1024, 768, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`${baseURL}/organization/projects`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.hse-app-header')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
    await page.screenshot({ path: `${screenshots}/projects-${width}.png`, fullPage: true })
  }
})

test('Arabic shell keeps RTL direction and Arabic typography', async ({ page }) => {
  await installFixtures(page, { locale: 'ar' })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(`${baseURL}/organization/projects`)
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('body')).toHaveCSS('font-family', /HSE Arabic/)
  await page.screenshot({ path: `${screenshots}/projects-ar-1280.png`, fullPage: true })
})

test('equipment and employee forms keep their sectioned responsive layouts', async ({ page }) => {
  page.setDefaultTimeout(20_000)
  await installFixtures(page)

  for (const [name, path, shell] of [
    ['equipment-form', '/organization/equipment/add', '.equipment-form'],
    ['employee-form', '/organization/organization-employee/add', '.employee-form-shell'],
  ]) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
      await expect(page.locator(shell)).toBeVisible()
      await expect(
        page.locator(`${shell} section, ${shell} .equipment-section-heading`).first(),
      ).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
      await page.screenshot({ path: `${screenshots}/${name}-${width}.png`, fullPage: true })
    }
  }
})

test('operational workflows share the identity and follow system branding', async ({ page }) => {
  page.setDefaultTimeout(20_000)
  await installFixtures(page)

  const listRoutes = [
    ['incidents', '/organization/equipment-mangement/incedant'],
    ['observations', '/organization/equipment-mangement/observation'],
    ['inspections', '/organization/equipment-mangement/inspection'],
    ['investigations', '/organization/Investigating'],
  ]

  for (const [name, path] of listRoutes) {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.hse-operations-page')).toBeVisible()
    await page.screenshot({ path: `${screenshots}/${name}-operations-1440.png`, fullPage: true })
  }

  const formRoutes = [
    ['incident-form', '/organization/equipment-mangement/incedant/add', '.full-observation-form'],
    [
      'observation-form',
      '/organization/equipment-mangement/observation/add',
      '.full-observation-form',
    ],
    [
      'inspection-form',
      '/organization/equipment-mangement/inspection/add',
      '.inspection-form-shell',
    ],
  ]

  for (const [name, path, shell] of formRoutes) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
      await expect(page.locator(shell)).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
      await page.screenshot({ path: `${screenshots}/${name}-${width}.png`, fullPage: true })
    }
  }

  await page.evaluate(() => {
    localStorage.setItem(
      'hse-system-identity',
      JSON.stringify({
        name: 'Custom HSE',
        logo: '',
        primaryColor: '#7c3aed',
        secondaryColor: '#123456',
        accentColor: '#f97316',
        extractedColors: [],
        isActive: true,
      }),
    )
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveCSS('--identity-primary', '#7c3aed')
})
