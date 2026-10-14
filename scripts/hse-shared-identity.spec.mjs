import { test, expect } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5186'
const screenshots = '/tmp/hse-shell-identity'
mkdirSync(screenshots, { recursive: true })

for (const locale of ['en', 'ar']) {
  test(`shared identity and interactions: ${locale}`, async ({ page }) => {
    page.setDefaultTimeout(15000)
    await installFixtures(page, { locale })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`${baseURL}/organization/project/flow`)
    await page.locator('.flow-actions').waitFor()
    await page.evaluate(() => document.fonts.ready)
    const font = locale === 'ar' ? /Regular/ : /HSE Project Studio/
    const header = page.locator('.hse-app-header')
    const multi = page.locator('.hse-select-field .p-multiselect').first()
    const date = page.locator('.hse-date-input').first()

    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.evaluate(() => window.scrollTo(0, 0))
      await expect(header).toBeVisible()
      await expect(header).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      await expect(header.locator('.logo')).toHaveCSS('font-family', font)
      expect(await header.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
      await page.screenshot({ path: `${screenshots}/verified-${locale}-${width}.png` })
      await multi.click()
      const options = page.locator('.hse-select-panel:visible')
      await expect(options).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      await expect(options).toHaveCSS('font-family', font)
      await expect(options.locator('.p-multiselect-list')).toHaveCSS('transform', 'none')
      await expect(multi).toHaveCSS('font-family', font)
      await expect(multi).toHaveCSS('border-radius', '9px')
      await options.getByRole('searchbox').fill('nothing-matches')
      await expect(options.locator('.p-multiselect-empty-message')).toBeVisible()
      await options.getByRole('searchbox').fill('')
      await expect(
        options.getByRole('option', { name: 'Test contractor', exact: true }),
      ).toBeVisible()
      await page.screenshot({ path: `${screenshots}/select-${locale}-${width}.png` })
      await multi.click()
      await expect(options).not.toBeVisible()
      await date.click()
      const calendar = page.locator('.hse-calendar:visible')
      await expect(calendar).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      await expect(calendar).toHaveCSS('font-family', font)
      await expect(date).toHaveCSS('font-family', font)
      await expect(date).toHaveCSS('border-radius', '9px')
      await expect(calendar).toHaveCSS('opacity', '1')
      expect(
        await calendar.evaluate(
          (el) =>
            el.getBoundingClientRect().right <= innerWidth + 1 &&
            el.getBoundingClientRect().left >= 0,
        ),
      ).toBe(true)
      await page.screenshot({ path: `${screenshots}/calendar-${locale}-${width}.png` })
      await calendar.locator('.p-datepicker-day').filter({ hasText: /^15$/ }).first().click()
      await expect(date).not.toHaveValue('')
      await expect(calendar).not.toBeVisible()
    }
    await page.setViewportSize({ width: 1440, height: 1000 })
    await multi.click()
    await page
      .locator('.hse-select-panel')
      .getByRole('option', { name: 'Test contractor', exact: true })
      .click()
    await multi.click()
    await expect(multi).toContainText('Test contractor')

    // Search/navigation/permission wrappers stay on the original sidebar paths.
    await page.locator('.side-rail-btn').nth(1).hover()
    const pane = page.locator('.side-pane')
    await expect(pane).toBeVisible()
    await pane.hover()
    await expect(pane).toHaveCSS('opacity', '1')
    await pane.locator('input').fill('no-match-123')
    await expect(pane.locator('.side-pane-empty')).toBeVisible()
    await pane.locator('input').fill('')
    await expect(pane.locator('a[href="/organization/projects"]')).toBeVisible()
    await page.screenshot({ path: `${screenshots}/navigation-${locale}.png` })
    await pane.locator('a[href="/organization/projects"]').click()
    await expect(page).toHaveURL(/\/organization\/projects$/)
    await expect(pane).not.toBeVisible()
    await page.setViewportSize({ width: 390, height: 1000 })
    await header.locator('.drawer').click()
    await page.locator('.side-rail-btn').nth(1).click()
    await expect(pane).toBeVisible()
    await pane.hover()
    expect(
      await pane.evaluate(
        (el) =>
          el.getBoundingClientRect().right <= innerWidth + 1 &&
          el.getBoundingClientRect().left >= 0,
      ),
    ).toBe(true)
    await page.screenshot({ path: `${screenshots}/navigation-mobile-${locale}.png` })
  })
}

test('DatePicker variants keep keyboard, disabled, invalid and dark states', async ({ page }) => {
  page.setDefaultTimeout(15000)
  await installFixtures(page)
  await page.goto(`${baseURL}/organization/project/flow`)
  await page.locator('.hse-date-picker').first().waitFor()
  // Mount the real component with the existing app context, without adding a production route.
  await page.evaluate(async () => {
    const vueModule = performance
      .getEntriesByType('resource')
      .find((entry) => new URL(entry.name).pathname.endsWith('/vue.js')).name
    const { h, createApp } = await import(vueModule)
    const primeModule = performance
      .getEntriesByType('resource')
      .find((entry) => new URL(entry.name).pathname.endsWith('/primevue_config.js')).name
    const { default: PrimeVue } = await import(primeModule)
    const source = document.querySelector('.hse-date-picker').__vueParentComponent
    const host = document.createElement('div')
    host.id = 'datepicker-qa'
    host.style.cssText =
      'position:fixed;inset:100px 120px;z-index:1000;background:white;padding:24px;overflow:auto'
    document.body.append(host)
    const vnode = h('section', { style: 'display:grid;gap:20px;max-width:650px' }, [
      h(source.type, { disabled: true, placeholder: 'Disabled date' }),
      h(source.type, { invalid: true, placeholder: 'Invalid date' }),
      h(source.type, { timeOnly: true, showIcon: true, placeholder: 'Choose time' }),
      h(source.type, { inline: true, selectionMode: 'range', numberOfMonths: 2 }),
    ])
    const app = createApp({ render: () => vnode })
    app.use(PrimeVue, source.appContext.config.globalProperties.$primevue.config)
    app.mount(host)
  })
  const host = page.locator('#datepicker-qa')
  await expect(host.getByPlaceholder('Disabled date')).toBeDisabled()
  await expect(host.getByPlaceholder('Invalid date')).toHaveCSS(
    'border-top-color',
    'rgb(217, 71, 85)',
  )
  await expect(host.locator('.hse-calendar')).toBeVisible()
  await host.getByPlaceholder('Choose time').click()
  const time = page.locator('.hse-calendar:has(.p-datepicker-time-picker)')
  await expect(time).toBeVisible()
  await expect(time).toHaveCSS('font-family', /HSE Project Studio/)
  await time.locator('button').first().click()
  await expect(host.getByPlaceholder('Choose time')).not.toHaveValue('')
  await page.keyboard.press('Escape')
  await expect(time).not.toBeVisible()
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
  await host.getByPlaceholder('Choose time').click()
  await expect(time).toHaveCSS('background-color', 'rgb(16, 36, 63)')
})
