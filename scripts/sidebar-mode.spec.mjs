import { test, expect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

test('sidebar mode applies only after saving, persists, and switches back to compact', async ({
  page,
}) => {
  await installFixtures(page)
  await page.goto(`${baseURL}/organization/system-identity`)
  const toggle = page.getByRole('switch', { name: /Always-open sidebar/ })
  await expect(toggle).not.toBeChecked()
  await expect(page.locator('.side-rail-nav')).toBeVisible()
  await toggle.check()
  await expect(page.locator('.side-rail-nav')).toBeVisible()
  await expect(page.locator('.expanded-navigation')).toHaveCount(0)
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  const nav = page.locator('.expanded-navigation')
  await expect(nav).toBeVisible()
  await expect(page.locator('.sidebar')).toHaveCSS('width', '300px')
  await expect(page.locator('.side-rail-nav')).toHaveCount(0)
  expect(await nav.locator('.side-route-group-title').count()).toBeGreaterThan(5)
  await expect(nav.locator('.side-route-children a').first()).toBeAttached()
  await page.getByRole('heading', { name: 'System Identity', exact: true }).hover()
  await expect(nav).toBeVisible()
  await page.reload()
  await expect(toggle).toBeChecked()
  await expect(nav).toBeVisible()
  await nav.locator('input[type=search]').fill('PPE Tools')
  await expect(nav.locator('a').filter({ hasText: 'PPE Tools' }).first()).toBeVisible()
  await nav.locator('input[type=search]').fill('')
  expect(await nav.locator('.side-route-group-title').count()).toBeGreaterThan(5)
  await toggle.uncheck()
  await expect(nav).toBeVisible()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(nav).toHaveCount(0)
  await expect(page.locator('.side-rail-nav')).toBeVisible()
  await expect(page.locator('.sidebar')).toHaveCSS('width', '90px')
})

test('expanded sidebar works for admin and uses a mobile drawer', async ({ page }) => {
  await installFixtures(page)
  await page.addInitScript(() => {
    const session = JSON.parse(localStorage.getItem('user'))
    session.user.type = 1
    localStorage.setItem('user', JSON.stringify(session))
    localStorage.setItem(
      'hse-system-identity',
      JSON.stringify({ appearance: { sidebarMode: 'expanded' } }),
    )
  })
  await page.goto(`${baseURL}/admin/team`)
  const nav = page.locator('.expanded-navigation')
  await expect(nav).toBeVisible()
  expect(await nav.locator('.side-route-group-title').count()).toBeGreaterThan(2)
  await expect(page.locator('.sidebar')).toHaveCSS('width', '300px')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: /open menu/i }).click()
  await expect(page.locator('.sidebar-container')).toHaveClass(/sidebar-open/)
  await expect(page.locator('.sidebar')).toHaveCSS('width', '300px')
  await expect(nav.locator('a').first()).toBeVisible()
  await page.locator('.sidebar-backdrop').click({ position: { x: 370, y: 400 } })
  await expect(page.locator('.sidebar-container')).not.toHaveClass(/sidebar-open/)
})

test('expanded sidebar remains open when brand identity is disabled', async ({ page }) => {
  await installFixtures(page)
  await page.addInitScript(() => {
    if (!localStorage.getItem('hse-system-identity')) {
      localStorage.setItem('hse-system-identity', JSON.stringify({ isActive: false }))
    }
  })
  await page.goto(`${baseURL}/organization/system-identity`)
  await expect(page.locator('#identity-active')).not.toBeChecked()
  await page.getByRole('switch', { name: /Always-open sidebar/ }).check()
  await expect(page.locator('.expanded-navigation')).toHaveCount(0)
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(page.locator('.expanded-navigation')).toBeVisible()
  await expect(page.locator('.sidebar')).toHaveCSS('width', '300px')
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hse-system-identity')))
  expect(saved.isActive).toBe(false)
  expect(saved.appearance.sidebarMode).toBe('expanded')
  await page.reload()
  await expect(page.locator('#identity-active')).not.toBeChecked()
  await expect(page.locator('.expanded-navigation')).toBeVisible()
  await expect(page.locator('.sidebar')).toHaveCSS('width', '300px')
})
