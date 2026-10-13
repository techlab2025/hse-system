import { test, expect } from '@playwright/test'
import { installFixtures, project } from './project-fixtures.mjs'

for (const locale of ['en', 'ar']) {
  test(`summary preserves real metric links and page identity: ${locale}`, async ({ page }) => {
    await installFixtures(page, { locale })
    await page.goto('/organization/project-summary/481')
    await expect(page.locator('.summary-identity h1')).toHaveText(project.title)
    await expect(page.locator('.operational-stat')).toHaveCount(7)
    await expect(page.locator('.safety-stat-card')).toHaveCount(6)
    await expect(page.locator('.quick-link')).toHaveCount(6)
    await expect(page.locator('.hse-overview-readiness')).toHaveAttribute('value', '60')
    await expect(page.locator('.operational-stat').first()).toHaveAttribute(
      'href',
      /data\/employees$/,
    )
    await page.locator('.full-details-link').click()
    await expect(page).toHaveURL(/project-details\/481$/, { timeout: 30_000 })
    await page.locator('.project-header-container').waitFor()
    await expect(page.locator('.project-name')).toHaveText(project.title)
    await expect(page.locator('.project-action-link')).toHaveCount(6)
  })

  test(`details populated resource panels and meeting dialog remain usable: ${locale}`, async ({
    page,
  }) => {
    await installFixtures(page, { locale })
    const zone = {
      zoon_id: 22,
      project_zoon_id: 122,
      zoon_title: 'Compression work area',
      title: 'Compression work area',
      project_zoon_equipments: [],
    }
    const location = {
      id: 11,
      title: 'North operating site',
      titles: [{ locale: 'en', title: 'North operating site' }],
      type: 1,
      zoons: [zone],
    }
    await page.route('**/fetch_project_details', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          data: {
            ...project,
            id: 481,
            locations: [location],
            project_zoons: [zone],
            team_locations: [
              {
                location_id: 11,
                project_location_id: 111,
                location_title: location.title,
                project_location_teams: [],
              },
            ],
          },
        }),
      }),
    )
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/organization/project-details/481')
    await page.locator('.project-header-container').waitFor()
    await expect(page.locator('.location-card')).toContainText(location.title)
    await expect(page.locator('.location-card')).toContainText(zone.title)
    const equipment = page.locator('.equipment-section .p-accordionheader')
    await expect(equipment).toContainText(zone.title)
    await equipment.click()
    await expect(equipment).toHaveAttribute('aria-expanded', 'true')
    await page.locator('.hse-overview-planning .add-drill-trigger').last().click()
    const dialog = page.locator('.p-dialog.hse-project-overview-overlay')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('form')).toBeVisible()
    await expect
      .poll(() => dialog.evaluate((e) => getComputedStyle(e).fontFamily))
      .toContain('HSE Project Studio')
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await page.setViewportSize({ width: 320, height: 900 })
    expect(
      await page.locator('.hse-project-overview').evaluate((e) => e.scrollWidth > e.clientWidth),
    ).toBe(false)
    expect(errors).toEqual([])
  })
}
