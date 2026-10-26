/** With Vite running: node scripts/sidebar-custom-groups-regression.mjs [http://127.0.0.1:5180] */
import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'
const origin = process.argv[2] || 'http://127.0.0.1:5180'
const browser = await chromium.launch({ channel: 'chromium', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 16000 } })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await installFixtures(page)
  await page.goto(`${origin}/organization/system-identity`)
  const editor = page.locator('.identity-sidebar-editor')
  const name = editor.getByRole('textbox', { name: 'New group name', exact: true })
  const add = editor.getByRole('button', { name: 'Add group', exact: true })
  const group = (key) => editor.locator(`:scope > ol > li[data-field="${key}"]`)
  const open = async (key) => {
    const details = group(key).locator(':scope > details')
    if ((await details.getAttribute('open')) === null)
      await details.locator(':scope > summary').click()
  }
  const drag = async (id, key) => {
    await editor
      .locator(`[data-drag-item="${id}"]`)
      .dragTo(editor.locator(`[data-drop-container="${key}"]`).first())
    await expect(editor.getByRole('button', { name: 'Cancel move', exact: true })).toBeDisabled()
    await expect
      .poll(() =>
        editor
          .locator(`[data-sidebar-item="${id}"]`)
          .evaluate((element) => element.closest('ol').getAttribute('aria-label')),
      )
      .toBe(`${key} menu order`)
  }
  await expect(add).toBeDisabled()
  await name.fill('   ')
  await expect(add).toBeDisabled()
  await name.fill('Safety management')
  await add.click()
  const safety = await editor.locator(':scope > ol > li').last().getAttribute('data-field')
  assert.match(safety, /^custom:[\w-]+$/)
  await expect(
    editor.getByRole('textbox', { name: 'Name for Safety management tab', exact: true }),
  ).toBeFocused()
  await expect(group(safety).locator('details')).toHaveAttribute('open', '')
  await name.fill('Documents')
  await name.press('Enter')
  const documents = await editor.locator(':scope > ol > li').last().getAttribute('data-field')
  assert.notEqual(safety, documents)
  await expect(page.locator('.identity-shell-preview aside')).toContainText('Safety management')
  await expect(page.locator('.identity-shell-preview aside')).toContainText('Documents')
  await open('operations')
  const submenu = group('operations').locator('li[data-field="equipment"] > details')
  if ((await submenu.getAttribute('open')) === null)
    await submenu.locator(':scope > summary').click()
  await drag('operations/equipment/Tools', documents)
  await drag('operations/Projects', safety)
  await drag('operations/equipment', safety)
  await editor
    .getByRole('textbox', { name: 'Name for Safety management tab', exact: true })
    .fill('Safety Hub')
  const earlier = editor.getByRole('button', { name: `Move ${safety} earlier`, exact: true })
  while (await earlier.isEnabled()) await earlier.click()
  await expect(editor.locator(':scope > ol > li').first()).toHaveAttribute('data-field', 'overview')
  await expect(editor.locator(':scope > ol > li').nth(1)).toHaveAttribute('data-field', safety)
  await expect(page.locator('.side-rail-nav')).not.toContainText('Safety Hub')
  await page.getByRole('switch', { name: /Always-open sidebar/ }).check()
  const save = page.getByRole('button', { name: 'Save and apply identity', exact: true })
  await save.click()
  const nav = page.locator('.expanded-navigation')
  await expect(
    nav.locator('.side-route-group-title').filter({ hasText: 'Safety Hub' }),
  ).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute(
    'href',
    '/organization/projects',
  )
  await expect(nav.getByRole('link', { name: 'Tools', exact: true })).toHaveAttribute(
    'href',
    /equipment_type=3/,
  )
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hse-system-identity')).appearance,
  )
  assert.equal(saved.sidebarCustomGroups.length, 2)
  assert.equal(saved.sidebarItemParents['operations/Projects'], safety)
  assert.equal(saved.sidebarItemParents['operations/equipment'], safety)
  assert.equal(saved.sidebarItemParents['operations/equipment/Tools'], documents)
  await page.reload()
  await page.waitForSelector('.identity-sidebar-editor')
  await expect(
    nav.locator('.side-route-group-title').filter({ hasText: 'Safety Hub' }),
  ).toBeVisible()
  await expect(
    editor.getByRole('textbox', { name: 'Name for Safety management tab', exact: true }),
  ).toHaveValue('Safety Hub')
  await editor.getByRole('button', { name: 'Remove Safety management group', exact: true }).click()
  await expect(group(safety)).toHaveCount(0)
  await expect(
    nav.locator('.side-route-group-title').filter({ hasText: 'Safety Hub' }),
  ).toBeVisible()
  await save.click()
  await expect(
    nav.locator('.side-route-group-title').filter({ hasText: 'Safety Hub' }),
  ).toHaveCount(0)
  const removed = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hse-system-identity')).appearance,
  )
  assert.equal(removed.sidebarCustomGroups.length, 1)
  assert.equal(removed.sidebarItemParents['operations/Projects'], undefined)
  assert.equal(removed.sidebarItemParents['operations/equipment'], undefined)
  assert.equal(removed.sidebarItemParents['operations/equipment/Tools'], documents)
  await expect(nav.getByRole('link', { name: 'Projects', exact: true })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Tools', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
  assert.deepEqual(errors, [])
  console.log(
    'PASS: add group by button/Enter, native drag of items and menus, rename/reorder, preview, save/reload, remove with items restored, mobile layout.',
  )
} finally {
  await browser.close()
}
