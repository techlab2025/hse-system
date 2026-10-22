import { test, expect as baseExpect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const expect = baseExpect.configure({ timeout: 15000 })
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

test('activity changes warn before clearing employees and PPE tools, and can be cancelled', async ({
  page,
}) => {
  await installFixtures(page)
  page.setDefaultTimeout(15000)
  const paginated = (data) => ({
    status: true,
    data: { data, meta: { current_page: 1, last_page: 1, per_page: 10, total: data.length } },
  })
  await page.route('**/fetch_ppe_activities', (route) =>
    route.fulfill({
      json: paginated([
        { id: 1, title: 'Activity One' },
        { id: 2, title: 'Activity Two' },
      ]),
    }),
  )
  await page.route('**/fetch_organization_employees', (route) =>
    route.fulfill({
      json: paginated([
        {
          id: 7,
          name: 'Mona',
          certificates: [],
          hierarchy: [],
          employee_certificates: [],
          hierarchies: [],
        },
      ]),
    }),
  )
  const fetchedActivities = []
  await page.route('**/fetch_ppe_active_tool_matrix', (route) => {
    const id = route.request().postDataJSON().ppe_activity_id
    fetchedActivities.push(id)
    return route.fulfill({
      json: {
        status: true,
        data: [
          {
            activity_id: id,
            ppe_tools: [{ id: id === 1 ? 11 : 22, title: id === 1 ? 'Helmet' : 'Gloves' }],
          },
        ],
      },
    })
  })
  await page.goto(`${baseURL}/organization/ppe-delivery`)
  const activityOne = page.locator('#delivery-activity-1')
  const activityTwo = page.locator('#delivery-activity-2')
  const warning = page.getByRole('dialog', { name: 'Change activity?', exact: true })
  const selectEmployee = async () => {
    await page.locator('.delivery-matrix-panel .p-multiselect').click()
    await page.getByRole('option', { name: /Mona/ }).click()
    await page.keyboard.press('Escape')
    await expect(page.locator('.delivery-matrix tbody')).toContainText('Mona')
  }
  await activityOne.check()
  await expect(warning).toHaveCount(0)
  await selectEmployee()
  await page.locator('#delivery-tool-7-11').check()

  await activityTwo.check()
  await expect(warning).toBeVisible()
  expect(fetchedActivities).toEqual([1])
  await warning.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(warning).toBeHidden()
  await expect(activityOne).toBeChecked()
  await expect(activityTwo).not.toBeChecked()
  await expect(page.locator('#delivery-tool-7-11')).toBeChecked()
  await expect(page.locator('.delivery-matrix tbody')).toContainText('Mona')

  await activityTwo.check()
  await warning.getByRole('button', { name: 'Clear selections and continue', exact: true }).click()
  await expect(activityTwo).toBeChecked()
  await expect(activityOne).not.toBeChecked()
  await expect(page.locator('.delivery-matrix tbody tr')).toHaveCount(0)
  await expect.poll(() => fetchedActivities).toEqual([1, 2])
  await selectEmployee()
  await page.locator('#delivery-tool-7-22').check()

  await activityTwo.uncheck()
  await expect(warning).toBeVisible()
  await warning.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(warning).toBeHidden()
  await expect(activityTwo).toBeChecked()
  await expect(page.locator('#delivery-tool-7-22')).toBeChecked()
  await activityTwo.uncheck()
  await warning.getByRole('button', { name: 'Clear selections and continue', exact: true }).click()
  await expect(activityTwo).not.toBeChecked()
  await expect(page.locator('.delivery-matrix-panel')).toHaveCount(0)
  expect(fetchedActivities).toEqual([1, 2])
})
