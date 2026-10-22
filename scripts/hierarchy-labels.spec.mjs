import { test, expect as baseExpect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const expect = baseExpect.configure({ timeout: 15000 })
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

test('add department and add position use their own names in the form and breadcrumbs', async ({
  page,
}) => {
  await installFixtures(page)
  await page.goto(`${baseURL}/organization/herikaly/add`)
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(breadcrumb).toContainText('Departments')
  await expect(breadcrumb).toContainText('Add Department')
  await expect(breadcrumb).not.toContainText('Position')
  await expect(page.locator('[data-required-field="langs"]')).toContainText('Department Name')
  await expect(page.locator('[data-required-field="Certificate"]')).toHaveCount(0)

  await page.goto(`${baseURL}/organization/herikaly/add/22`)
  await expect(breadcrumb).toContainText('Positions')
  await expect(breadcrumb).toContainText('Add Position')
  await expect(page.locator('[data-required-field="langs"]')).toContainText('Position Name')
})

test('edit labels follow the loaded hierarchy record, including on direct navigation', async ({
  page,
}) => {
  await installFixtures(page)
  let isPosition = false
  await page.route('**/fetch_herikaly_details', (route) =>
    route.fulfill({
      json: {
        status: true,
        data: {
          id: 22,
          titles: [{ locale: 'en', title: isPosition ? 'Safety Officer' : 'Safety Department' }],
          parent_id: isPosition ? 10 : null,
          parent: isPosition
            ? { id: 10, titles: [{ locale: 'en', title: 'Safety Department' }] }
            : null,
          certificates: [],
          children: [],
        },
      },
    }),
  )
  await page.goto(`${baseURL}/organization/herikaly/22`)
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(breadcrumb).toContainText('Departments')
  await expect(breadcrumb).toContainText('Edit Department')
  await expect(breadcrumb).not.toContainText('Position')
  await expect(page.locator('[data-required-field="langs"]')).toContainText('Department Name')
  await expect(page.locator('[data-required-field="department"]')).toHaveCount(0)
  await expect(page.locator('[data-required-field="Certificate"]')).toHaveCount(0)

  isPosition = true
  await page.reload()
  await expect(breadcrumb).toContainText('Positions')
  await expect(breadcrumb).toContainText('Edit Position')
  await expect(page.locator('[data-required-field="langs"]')).toContainText('Position Name')
  await expect(page.locator('[data-required-field="department"]')).toBeVisible()
})
