/** With Vite running: node scripts/sidebar-layout-regression.mjs [http://127.0.0.1:5180] */
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
  const group = (key) => editor.locator(`:scope > ol > li[data-field="${key}"]`)
  const openGroup = async (key) => {
    const details = group(key).locator(':scope > details')
    if ((await details.getAttribute('open')) === null)
      await details.locator(':scope > summary').click()
  }
  const rename = (id, label) => editor.locator(`[data-sidebar-item="${id}"]`).fill(label)
  const dragItem = async (id, container) => {
    if (container.includes('/')) {
      await openGroup('company')
      await openGroup('operations')
    }
    const source = editor.locator(`[data-drag-item="${id}"]`)
    const destination = editor.locator(`[data-drop-container="${container}"]`).first()
    await source.dragTo(destination)
    await expect(editor.getByRole('button', { name: 'Cancel move', exact: true })).toBeDisabled()
    await expect
      .poll(() =>
        editor
          .locator(`[data-sidebar-item="${id}"]`)
          .evaluate((element) => element.closest('ol').getAttribute('aria-label')),
      )
      .toBe(`${container} menu order`)
  }

  await expect(group('overview')).toHaveAttribute('draggable', 'false')
  await expect(
    editor.getByRole('button', { name: 'Move overview later', exact: true }).first(),
  ).toBeDisabled()
  await expect(
    editor.getByRole('button', { name: 'Move operations earlier', exact: true }),
  ).toBeDisabled()
  await editor
    .getByRole('textbox', { name: 'Name for Overview tab', exact: true })
    .fill('Start Here')
  await editor
    .getByRole('textbox', { name: 'Name for Reports tab', exact: true })
    .fill('Work Center')
  await openGroup('overview')
  await rename('overview/overview', 'Getting Started')
  await expect(editor.locator('select')).toHaveCount(0)
  await openGroup('operations')
  await rename('operations/Projects', 'Sites')
  await rename('operations/equipment', 'Assets')
  const equipment = group('operations').locator('li[data-field="equipment"]')
  await equipment.locator('details > summary').click()
  await rename('operations/equipment/Tools', 'Hand Tools')
  await dragItem('operations/equipment/Tools', 'lockups')
  await dragItem('operations/Projects', 'reports')
  await dragItem('operations/equipment', 'company')
  await expect(
    group('operations').locator('[data-sidebar-item="operations/Projects"]'),
  ).toHaveCount(0)
  await openGroup('reports')
  await rename('reports/incident_report', 'Events')
  await dragItem('reports/incident_report', 'operations/equipment')
  await editor
    .getByRole('button', { name: 'Move operations/Projects earlier', exact: true })
    .click()
  await editor.getByRole('button', { name: 'Move reports earlier', exact: true }).click()
  await editor.getByRole('button', { name: 'Move reports earlier', exact: true }).click()
  await expect(group('overview')).toHaveAttribute('draggable', 'false')
  await expect(group('overview')).toBeAttached()
  // Changes remain a draft until Save.
  await expect(page.locator('.side-rail-nav')).not.toContainText('Work Center')
  await page.getByRole('switch', { name: /Always-open sidebar/ }).check()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  const nav = page.locator('.expanded-navigation')
  await expect(nav).toBeVisible()
  await expect(nav.locator('.side-route-group-title').first()).toHaveText('Start Here')
  await expect(nav.getByRole('link', { name: 'Getting Started', exact: true })).toHaveAttribute(
    'href',
    '/organization/project-progress',
  )
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hse-system-identity')).appearance,
  )
  assert.equal(saved.sidebarOrder[0], 'overview')
  assert.equal(saved.sidebarOrder[1], 'reports')
  assert.equal(saved.sidebarItemParents['operations/Projects'], 'reports')
  assert.equal(saved.sidebarItemParents['operations/equipment'], 'company')
  assert.equal(saved.sidebarItemParents['operations/equipment/Tools'], 'lockups')
  assert.equal(saved.sidebarItemParents['reports/incident_report'], 'operations/equipment')
  await expect(nav.getByRole('link', { name: 'Sites', exact: true })).toHaveAttribute(
    'href',
    '/organization/projects',
  )
  await expect(nav.getByRole('link', { name: 'Hand Tools', exact: true })).toHaveAttribute(
    'href',
    /equipment_type=3/,
  )
  await expect(
    nav.locator('.side-route-children').getByRole('link', { name: 'Events', exact: true }),
  ).toBeVisible()
  await nav.locator('input[type=search]').fill('Hand Tools')
  await expect(nav.getByRole('link', { name: 'Hand Tools' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Sites', exact: true })).toHaveCount(0)
  await nav.locator('input[type=search]').fill('')
  await page.reload()
  await page.waitForSelector('.identity-sidebar-editor')
  await expect(nav.getByRole('link', { name: 'Sites', exact: true })).toBeVisible()
  await expect(
    nav.locator('.side-route-children').getByRole('link', { name: 'Events', exact: true }),
  ).toBeVisible()
  await expect(
    editor.getByRole('textbox', { name: 'Name for Reports tab', exact: true }),
  ).toHaveValue('Work Center')
  // Moving an item back to its original tab removes its placement override.
  await openGroup('reports')
  await dragItem('operations/Projects', 'operations')
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('hse-system-identity')).appearance.sidebarItemParents[
          'operations/Projects'
        ],
    ),
    undefined,
  )
  await editor.getByRole('button', { name: 'Restore sidebar defaults', exact: true }).click()
  await expect(
    editor.getByRole('textbox', { name: 'Name for Reports tab', exact: true }),
  ).toHaveValue('')
  await expect(nav.getByRole('link', { name: 'Hand Tools', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(nav.getByRole('link', { name: 'Hand Tools', exact: true })).toHaveCount(0)
  const restored = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hse-system-identity')).appearance,
  )
  assert.deepEqual(restored.sidebarLabels, {})
  assert.deepEqual(restored.sidebarItemParents, {})
  // A moved root item keeps its own access rules inside a submenu with a restricted parent.
  await openGroup('operations')
  await dragItem('operations/Inspection', 'operations/equipment')
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    const { PermissionsEnum } = await import(
      '/src/features/users/Admin/Core/Enum/permission_enum.ts'
    )
    const user = useUserStore().user
    user.isMaster = 0
    user.employeeType = 2
    user.permission = [PermissionsEnum.ORG_INSPECTION_FETCH]
  })
  await expect(
    nav.locator('.side-route-children').getByRole('link', { name: 'Inspection', exact: true }),
  ).toBeVisible()
  await expect(nav.locator('a[href="/organization/equipments"]')).toHaveCount(0)
  await expect(nav.getByRole('link', { name: 'Projects', exact: true })).toHaveCount(0)
  await page.evaluate(async () => {
    const { useUserStore } = await import('/src/stores/user.ts')
    useUserStore().user.isMaster = 1
  })
  // The same saved labels and placements apply to the compact sidebar.
  await editor
    .getByRole('textbox', { name: 'Name for Reports tab', exact: true })
    .fill('Reports Hub')
  const submenu = group('operations').locator('li[data-field="equipment"] > details')
  if ((await submenu.getAttribute('open')) === null)
    await submenu.locator(':scope > summary').click()
  await rename('operations/equipment/Tools', 'Hand Tools')
  await dragItem('operations/equipment/Tools', 'reports')
  await page.getByRole('switch', { name: /Always-open sidebar/ }).uncheck()
  await page.getByRole('button', { name: 'Save and apply identity', exact: true }).click()
  await expect(nav).toHaveCount(0)
  const rail = page.locator('.side-rail-nav')
  await expect(rail.getByRole('button').first()).toHaveAttribute('title', 'Overview')
  await rail.getByRole('button', { name: 'Reports Hub', exact: true }).hover()
  await expect(
    page.locator('.side-pane').getByRole('link', { name: 'Hand Tools', exact: true }),
  ).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await editor.scrollIntoViewIfNeeded()
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl'
  })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
  assert.deepEqual(errors, [])
  console.log(
    'PASS: tab/item renaming, cross-tab and submenu moves, reorder, pinned Overview, draft/save/reload, search, moving back and restoring defaults.',
  )
} finally {
  await browser.close()
}
