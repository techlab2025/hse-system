import { test, expect as baseExpect } from '@playwright/test'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const expect = baseExpect.configure({ timeout: 15000 })
const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

async function setup(page) {
  await installFixtures(page)
  const requests = []
  for (const [endpoint, title] of [
    ['fetch_ppe_activities', 'Working at height'],
    ['fetch_ppe_tools', 'Safety helmet'],
  ]) {
    await page.route(`**/${endpoint}`, (route) => {
      requests.push(endpoint)
      return route.fulfill({
        json: {
          status: true,
          data: {
            data: [{ id: 1, title }],
            meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
          },
        },
      })
    })
  }
  return requests
}

test('PPE Matrix combines both lists and keeps the selected tab after reload', async ({ page }) => {
  const requests = await setup(page)
  await page.goto(`${baseURL}/organization/ppe-matrix-settings`)
  await expect(page.getByRole('heading', { name: 'PPE Matrix', exact: true })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'PPE Activity', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.locator('.ppe-matrix-settings tbody')).toContainText('Working at height')
  expect(requests).toEqual(['fetch_ppe_activities'])
  await page.getByRole('tab', { name: 'PPE Tools', exact: true }).click()
  await expect(page).toHaveURL(/ppe-matrix-settings\?tab=tools$/)
  await expect(page.locator('.ppe-matrix-settings tbody')).toContainText('Safety helmet')
  await page.reload()
  await expect(page.getByRole('tab', { name: 'PPE Tools', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.locator('.ppe-matrix-settings tbody')).toContainText('Safety helmet')
  await page.locator('.side-rail-btn[title="Lookups"]').hover()
  await expect(
    page.locator('#organization-sidebar-pane a[href="/organization/ppe-matrix-settings"]'),
  ).toBeVisible()
  await expect(
    page.locator('#organization-sidebar-pane a[href="/organization/ppe-activities"]'),
  ).toHaveCount(0)
  await expect(
    page.locator('#organization-sidebar-pane a[href="/organization/ppe-tools"]'),
  ).toHaveCount(0)
})

test('legacy PPE lists open the correct tab and the existing matrix log stays available', async ({
  page,
}) => {
  await setup(page)
  await page.goto(`${baseURL}/organization/ppe-tools`)
  await expect(page).toHaveURL(/ppe-matrix-settings\?tab=tools$/)
  await expect(page.getByRole('tab', { name: 'PPE Tools', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.goto(`${baseURL}/organization/ppe-activities`)
  await expect(page).toHaveURL(/ppe-matrix-settings\?tab=activities$/)
  await expect(page.getByRole('tab', { name: 'PPE Activity', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.goto(`${baseURL}/organization/ppe-matrix`)
  await expect(page.getByRole('heading', { name: 'PPE Matrix & Log', exact: true })).toBeVisible()
})

test('PPE Matrix only shows and fetches permitted tabs', async ({ page }) => {
  const requests = await setup(page)
  await page.addInitScript(() => {
    const session = JSON.parse(localStorage.getItem('user'))
    session.user.isMaster = 0
    session.user.permission = ['OPPETF01']
    localStorage.setItem('user', JSON.stringify(session))
  })
  await page.goto(`${baseURL}/organization/ppe-matrix-settings?tab=activities`)
  await expect(page.getByRole('tab', { name: 'PPE Activity', exact: true })).toHaveCount(0)
  await expect(page.getByRole('tab', { name: 'PPE Tools', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.locator('.ppe-matrix-settings tbody')).toContainText('Safety helmet')
  expect(requests).toEqual(['fetch_ppe_tools'])
})
