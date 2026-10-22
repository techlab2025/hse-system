import { test, expect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

test('employee position dialog can create a department using only its name', async ({ page }) => {
  await installFixtures(page)
  const calls = []
  await page.route('**/create_herikaly', (route) => {
    calls.push(route.request().postDataJSON())
    return route.fulfill({ json: { status: true, message: 'Department created' } })
  })
  await page.goto(`${baseURL}/organization/organization-employee/add`)
  await page.locator('[data-required-field="Heirarchy"] .inline-create-action').click()
  const position = page
    .locator('.p-dialog')
    .filter({ has: page.locator('[data-required-field="department"]') })
  await expect(position).toBeVisible()
  await position.locator('[data-required-field="department"] .inline-create-action').click()
  const department = page.locator('.p-dialog').filter({ hasText: 'Department Name' })
  await expect(department).toBeVisible()
  await expect(department.locator('[data-required-field="department"]')).toHaveCount(0)
  await expect(department.locator('[data-required-field="Certificate"]')).toHaveCount(0)
  await department.locator('input.text-input').fill('Safety Department')
  await department.getByRole('button', { name: 'Save', exact: true }).click()
  await expect.poll(() => calls.length).toBe(1)
  expect(JSON.stringify(calls[0].translations)).toContain('Safety Department')
  expect(calls[0].certificate_ids).toEqual([])
  expect(calls[0]).not.toHaveProperty('parent_id')
  await expect(department).toHaveCount(0)
  await expect(position).toBeVisible()
  await expect(page).toHaveURL(/organization-employee\/add$/)
})
