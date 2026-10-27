import { test, expect } from '@playwright/test'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

for (const uiLanguage of ['en', 'ar']) {
  test(`Arabic fields stay upright in the ${uiLanguage} interface`, async ({ page }) => {
    await page.goto(`${baseURL}/scripts/fixtures/localized-input.html`)
    await page.evaluate((lang) => {
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    }, uiLanguage)

    for (const selector of ['input.lang-input', 'textarea']) {
      const field = page.locator(selector)
      const wrapper = page.locator('.input-wrapper').filter({ has: field })
      await wrapper.locator('label[title="AR"]').click()
      await field.fill('مرحبا بالعالم 123')
      await expect(field).toHaveAttribute('dir', 'rtl')
      await expect(field).toHaveValue('مرحبا بالعالم 123')
      await expect(field).toHaveCSS('direction', 'rtl')
      await expect(field).toHaveCSS('transform', 'none')
      await expect(field).toHaveCSS('rotate', 'none')
      await wrapper.locator('label[title="EN"]').click()
      await field.fill('Hello world 123')
      await expect(field).toHaveCSS('direction', 'ltr')
      await expect(field).toHaveCSS('transform', 'none')
      await wrapper.locator('label[title="AR"]').click()
      await expect(field).toHaveValue('مرحبا بالعالم 123')
    }

    // Directional arrows must retain their intended rotation.
    await expect(page.getByTestId('directional-arrow')).toHaveCSS(
      'transform',
      'matrix(-1, 0, 0, -1, 0, 0)',
    )
    await expect(page.locator('div[dir="rtl"]')).toHaveCSS('transform', 'none')
  })
}
