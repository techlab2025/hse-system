import { test, expect as playwrightExpect } from '@playwright/test'
const expect = playwrightExpect.configure({ timeout: 20_000 })
import { mkdirSync } from 'node:fs'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const screenshots = '/tmp/hse-project-assurance'
mkdirSync(screenshots, { recursive: true })
const visit = {
  id: 21,
  date: '2026-10-20',
  location: 'North site',
  status: 1,
  employees: [{ id: 1, employee_id: 1, employee_name: 'Test manager' }],
  activities: [{ id: 1, title: 'Site review' }],
  creatable: { id: 1, name: 'Test manager' },
  has_report: false,
  report_added: false,
}
async function fixtures(page, locale = 'en') {
  await installFixtures(page, { locale })
  await page.route('**/fetch_visits', (route) =>
    route.fulfill({
      json: {
        data: [visit, { ...visit, id: 22, has_report: true, report_added: true }],
        status: true,
      },
    }),
  )
  await page.route('**/fetch_visit_report', (route) =>
    route.fulfill({
      json: {
        data: {
          id: 22,
          visit_id: 22,
          date: visit.date,
          engagement_topic: 'Site safety',
          engagement_discussion: 'Controls reviewed',
          positive_observations: 'Good housekeeping',
          areas_of_improvement: [],
          media: [],
        },
        status: true,
      },
    }),
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
}
const routes = [
  ['leadership', '/organization/project-details/433/leadership', '.hero'],
  ['visits', '/organization/project-details/433/leadership/visits', '.visits-card'],
  ['report', '/organization/project-details/433/leadership/visits/21/report', '.form-section'],
  ['risk', '/organization/project-details/433/risk-assessments', '.risk-hero'],
  ['create-risk', '/organization/project-details/433/risk-assessments/create', '.form-header'],
]
for (const locale of ['en', 'ar']) {
  test(`assurance pages follow identity and fit desktop/mobile: ${locale}`, async ({ page }) => {
    await fixtures(page, locale)
    for (const [name, route, header] of routes) {
      await page.goto(`${baseURL}${route}`)
      const root = page.locator('main.hse-project-assurance')
      await expect(root).toBeVisible()
      await expect(root.locator(header).first()).toBeVisible()
      await expect(root).toHaveCSS('font-family', locale === 'ar' ? /HSE Arabic/ : /HSE Inter/)
      await expect(root.locator(header).first()).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 })
        expect(
          await root.evaluate((el) => el.scrollWidth <= el.clientWidth + 2),
          `${name}: ${locale} ${width}`,
        ).toBe(true)
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
          `${name}: page ${locale} ${width}`,
        ).toBe(true)
        if (width === 1440 || width === 390)
          await page.screenshot({
            path: `${screenshots}/${name}-${locale}-${width}.png`,
            fullPage: true,
          })
      }
    }
  })
  test(`details dialogs retain identity and close correctly: ${locale}`, async ({ page }) => {
    await fixtures(page, locale)
    for (const [route, trigger, dialogClass] of [
      [
        '/organization/project-details/433/leadership/visits',
        '.report-link--details',
        '.report-details-dialog',
      ],
      [
        '/organization/project-details/433/risk-assessments',
        '.details-button',
        '.risk-details-dialog',
      ],
    ]) {
      await page.goto(`${baseURL}${route}`)
      await page.locator(trigger).first().click()
      const dialog = page.locator(`.p-dialog${dialogClass}`)
      await expect(dialog).toBeVisible()
      await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      await expect(dialog).toHaveClass(/hse-project-assurance/)
      await expect(dialog.locator('.p-dialog-header')).toHaveCSS(
        'background-color',
        'rgb(255, 255, 255)',
      )
      await expect(dialog).toHaveCSS('font-family', locale === 'ar' ? /HSE Arabic/ : /HSE Inter/)
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 900 })
        expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 2)).toBe(true)
        await page.screenshot({
          path: `${screenshots}/${dialogClass.slice(1)}-${locale}-${width}.png`,
        })
      }
      await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()
    }
  })
}
test('custom colors and dark surfaces reach project controls and portals', async ({ page }) => {
  await fixtures(page)
  await page.goto(`${baseURL}/organization/project-details/433/risk-assessments/create`)
  await expect(page.locator('.create-page')).toBeVisible()
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--identity-primary', '#8b5cf6')
    document.documentElement.setAttribute('data-theme', 'dark')
  })
  await expect(page.locator('.form-header')).toHaveCSS('background-color', 'rgb(16, 35, 63)')
  await expect(page.locator('.create-page')).toHaveCSS('--hse-project-blue', '#8b5cf6')
  await page.locator('.p-datepicker input').first().click()
  const calendar = page.locator('.p-datepicker-panel.hse-project-assurance')
  await expect(calendar).toBeVisible()
  await expect(calendar).toHaveCSS('--hse-project-blue', '#8b5cf6')
  await expect(calendar).toHaveCSS('font-family', /HSE Inter/)
  await page.screenshot({ path: `${screenshots}/custom-dark-calendar.png` })
})

// Mount shared media controls with the running app context so the real PrimeVue and i18n
// plugins are exercised without relying on unrelated feature forms to expose them.
for (const locale of ['en', 'ar']) {
  test(`shared image upload and gallery use identity: ${locale}`, async ({ page }) => {
    await fixtures(page, locale)
    await page.goto(`${baseURL}/organization/project-details/433/risk-assessments`)
    await expect(page.locator('.risk-page')).toBeVisible()
    await page.evaluate(async () => {
      const { h, render } = await import('/node_modules/.vite/deps/vue.js')
      const { default: UploadMultiImage } = await import(
        '/src/shared/HelpersComponents/UploadMultiImage.vue'
      )
      const host = document.createElement('div')
      host.id = 'identity-media-test'
      document.querySelector('.risk-page').append(host)
      const vnode = h(UploadMultiImage, { variant: 'evidence' })
      vnode.appContext = document.querySelector('#app').__vue_app__._context
      render(vnode, host)
    })
    const host = page.locator('#identity-media-test')
    await expect(host.locator('.upload-trigger')).toBeVisible()
    const svg = (color) =>
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="${color}"/></svg>`,
      )
    await host.locator('input[type=file]').setInputFiles([
      { name: 'first.svg', mimeType: 'image/svg+xml', buffer: svg('#246bfe') },
      { name: 'second.svg', mimeType: 'image/svg+xml', buffer: svg('#0aa778') },
    ])
    await host.locator('.multi-images-dialog__trigger').click()
    const dialog = page.locator('.media-gallery-dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    await expect(dialog.locator('.p-dialog-header')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    )
    await expect(dialog.locator('.gallery-dialog-toolbar__position span')).toHaveText('01')
    await dialog.locator('[data-pc-section="nextbutton"]').click()
    await expect(dialog.locator('.gallery-dialog-toolbar__position span')).toHaveText('02')
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--identity-primary', '#8b5cf6')
      document.documentElement.setAttribute('data-theme', 'dark')
    })
    await expect(dialog.locator('.gallery-dialog-header__icon')).toHaveCSS(
      'background-color',
      'rgb(139, 92, 246)',
    )
    await expect(dialog.locator('.p-dialog-header')).toHaveCSS(
      'background-color',
      'rgb(16, 35, 63)',
    )
    await page.setViewportSize({ width: 390, height: 900 })
    expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 2)).toBe(true)
    await page.screenshot({ path: `${screenshots}/shared-media-${locale}-390.png` })
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })
}
