import { test, expect } from '@playwright/test'
import { installFixtures, project } from './project-fixtures.mjs'

for (const locale of ['en', 'ar']) {
  test(`planning identity, dialogs and portals: ${locale}`, async ({ page }) => {
    page.setDefaultTimeout(10000)
    await installFixtures(page, { locale })
    await page.route('**/fetch_project_details', async (route) => {
      await route.fulfill({
        json: {
          data: {
            ...project,
            drills: [
              {
                id: 1,
                serial: 'DR-01',
                date: '2026-10-20',
                notes: 'Evacuation',
                drill_type: { id: 1, title: 'Fire drill' },
                project_team: { id: 1, title: 'Site team' },
              },
            ],
            meetings: [{ id: 1, date: '2099-10-20', serial_name: 'MT-01', has_result: false }],
          },
          status: true,
        },
      })
    })
    await page.goto('/organization/project-details/433')
    const font = locale === 'ar' ? /Regular/ : /HSE Project Studio/
    const dialog = page.locator('.p-dialog.hse-project-planning:visible').last()
    for (const key of ['drills', 'meetings']) {
      await page.locator(`[data-details-filter="${key}"]`).click()
      const section = page.locator('.project-drill-section')
      await expect(section.locator('h2')).toHaveCSS('font-family', font)
      await section.locator('.add-drill-trigger').click()
      await expect(dialog).toBeVisible()
      await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      await expect(dialog.locator('h2')).toHaveCSS('font-family', font)
      await expect(dialog.locator('label').first()).toHaveCSS('font-family', font)
      await dialog.locator('.p-select').first().click()
      const select = page.locator('.p-select-overlay.hse-project-planning')
      await expect(select).toBeVisible()
      await expect(select).toHaveCSS('font-family', font)
      await expect(select).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      await dialog.locator('.p-select').first().click()
      await expect(select).not.toBeVisible()
      if (key === 'drills') {
        await dialog.locator('.p-datepicker input').first().click()
        const calendar = page.locator('.p-datepicker-panel.hse-project-planning')
        await expect(calendar).toBeVisible()
        await expect(calendar).toHaveCSS('font-family', font)
        await calendar.locator('.p-datepicker-day').filter({ hasText: /^15$/ }).first().click()
        await expect(calendar).not.toBeVisible()
      }
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        await expect
          .poll(() => dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 2))
          .toBe(true)
        await page.screenshot({
          path: `/tmp/planning-${key}-${locale}-${width}.png`,
          fullPage: true,
        })
      }
      await dialog.locator('.p-dialog-close-button').click()
      await page.setViewportSize({ width: 1440, height: 900 })
      await section.locator(key === 'drills' ? '.drill-card' : '.meeting-card').click()
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('h2').first()).toHaveCSS('font-family', font)
      await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      if (key === 'drills') {
        await dialog.locator('.drill-workflow-actions button').first().click()
        await expect(dialog.locator('.drill-timeline-builder')).toBeVisible()
      }
      await page.setViewportSize({ width: 390, height: 900 })
      await expect
        .poll(() => dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 2))
        .toBe(true)
      await page.screenshot({ path: `/tmp/planning-${key}-details-${locale}.png`, fullPage: true })
      await dialog.locator('.p-dialog-close-button').click()
    }
  })
}
