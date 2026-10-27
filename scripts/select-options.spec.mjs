import { test, expect } from '@playwright/test'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
test.beforeEach(async ({ page }) => {
  // Standalone component fixture: no authenticated session or API requests.
  await page.goto(`${baseURL}/scripts/fixtures/select-options.html`)
  await expect(page.getByRole('combobox')).toBeVisible()
})

test('an empty placeholder model does not create a blank final option', async ({ page }) => {
  await page.getByRole('combobox').click()
  await expect(page.getByRole('option')).toHaveText(['First', 'Second — Department'])
  await page.getByRole('option', { name: 'First', exact: true }).click()
  expect(await page.evaluate(() => window.selectState.modelValue.id)).toBe(1)
})

test('keeps valid zero IDs and selected missing records while ignoring empty API entries', async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.assign(window.selectState, {
      modelValue: { id: 9, title: 'Assigned record' },
      options: [
        null,
        { id: 0, title: 'All' },
        { id: 1, title: 'First' },
        { id: 3, title: '' },
        { id: 4, title: '   ' },
      ],
      prependOptions: [{ id: 0, title: 'All' }],
      excludedOptionIds: [1, 9],
    })
  })
  await page.getByRole('combobox').click()
  await expect(page.getByRole('option')).toHaveText(['All', 'Assigned record'])
  await page.getByRole('option', { name: 'All', exact: true }).click()
  expect(await page.evaluate(() => window.selectState.modelValue.id)).toBe(0)
})

test('multiselect filters blank records and retains valid selected options', async ({ page }) => {
  await page.evaluate(() => {
    Object.assign(window.selectState, {
      type: 2,
      modelValue: [{ id: 9, title: 'Assigned record' }],
      options: [{ id: 1, title: 'First' }, { id: 2, title: '' }, null],
    })
  })
  await page.locator('.p-multiselect').click()
  await expect(page.getByRole('option')).toHaveText(['First', 'Assigned record'])
  await page.getByRole('option', { name: 'First', exact: true }).click()
  expect(await page.evaluate(() => window.selectState.modelValue.map((value) => value.id))).toEqual(
    [9, 1],
  )
})

test('autofill selects the single valid fetched record despite empty rows', async ({ page }) => {
  await page.evaluate(() =>
    window.setFetchedOptions([null, { id: 3, title: ' ' }, { id: 1, title: 'First' }]),
  )
  await expect.poll(() => page.evaluate(() => window.selectState.modelValue.id)).toBe(1)
  await page.getByRole('combobox').click()
  await expect(page.getByRole('option')).toHaveText(['First'])
})
