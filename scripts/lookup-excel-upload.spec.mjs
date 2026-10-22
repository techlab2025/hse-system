import { test, expect } from '@playwright/test'
import * as XLSX from 'xlsx'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

for (const withHints of [false, true]) {
  test(`PPE Activity submits capitalized Title from Excel ${withHints ? 'with hints' : 'without hints'}`, async ({
    page,
  }) => {
    await installFixtures(page)
    await page.route('**/fetch_ppe_activities', (route) =>
      route.fulfill({
        json: {
          status: true,
          data: {
            data: [{ id: 1, title: 'Existing activity' }],
            meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
          },
        },
      }),
    )
    const calls = []
    await page.route('**/create_ppe_activity', (route) => {
      calls.push(route.request().postDataJSON())
      return route.fulfill({ json: { status: true, message: 'Added successfully' } })
    })
    await page.goto(`${baseURL}/organization/ppe-activities`)
    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet([
      ...(withHints ? [['Fill the Title column below.\nOnly Title cells are editable.'], []] : []),
      ['Title'],
      ['Safety inspection'],
      ['Working at height'],
    ])
    if (withHints) sheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }]
    XLSX.utils.book_append_sheet(workbook, sheet, 'PPE Activities')
    await page
      .locator('input[type=file][accept=".xls,.xlsx"]')
      .first()
      .setInputFiles({
        name: 'ppe-activities.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
      })
    await expect(page.locator('.table-container')).toContainText('Safety inspection')
    await expect(page.getByText('Title is required', { exact: true })).toHaveCount(0)
    await page.locator('.btn-confirm').click()
    await expect
      .poll(() => calls)
      .toEqual([
        {
          data: [{ title: 'Safety inspection' }, { title: 'Working at height' }],
        },
      ])
    await expect(page.locator('.btn-confirm')).toHaveCount(0)
    await expect(page.getByText('Title is required', { exact: true })).toHaveCount(0)
  })
}
