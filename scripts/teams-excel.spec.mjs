import { test, expect } from '@playwright/test'
import * as XLSX from 'xlsx'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'

test('Teams downloads the formatted template and uploads its Title values', async ({ page }) => {
  await installFixtures(page)
  await page.route('**/fetch_teams', (route) =>
    route.fulfill({
      json: {
        status: true,
        data: {
          data: [{ id: 1, title: 'Existing Team' }],
          meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
        },
      },
    }),
  )
  const calls = []
  await page.route('**/create_team', (route) => {
    calls.push(route.request().postDataJSON())
    return route.fulfill({
      json: {
        status: true,
        message: 'Added successfully',
        data: { id: 2, title: 'Example Team' },
      },
    })
  })
  await page.goto(`${baseURL}/organization/team`)
  await page.locator('.action-list-trigger').click()
  const downloaded = page.waitForEvent('download')
  await page
    .locator('.action-list-body button')
    .filter({ hasText: /download/i })
    .click()
  const download = await downloaded
  expect(download.suggestedFilename()).toBe('team_form.xlsx')
  const stream = await download.createReadStream()
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  const buffer = Buffer.concat(chunks)
  const workbook = XLSX.read(buffer)
  const sheet = workbook.Sheets.Teams
  expect(sheet.A1.v).toContain('Only Title cells are editable')
  expect(sheet.A1.v).not.toContain('This data is for all industries.')
  expect(sheet['!merges']).toEqual([{ s: { r: 0, c: 0 }, e: { r: 1, c: 10 } }])
  expect(sheet.A3.v).toBe('Title')
  await page.locator('.action-list-trigger').click()
  await page.locator('input[type=file][accept=".xls,.xlsx"]').first().setInputFiles({
    name: 'team_form.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer,
  })
  await expect(page.locator('.upload-team-sheet')).toContainText('Example Team')
  await page.locator('.confirm-button').click()
  await expect
    .poll(() => calls)
    .toEqual([
      {
        data: [{ title: 'Example Team' }, { title: 'Example Team 2' }],
      },
    ])
  await expect(page.locator('.upload-team-sheet')).toHaveCount(0)
})

test('admin Teams template includes the all industries hint', async ({ page }) => {
  await installFixtures(page)
  await page.addInitScript(() => {
    const session = JSON.parse(localStorage.getItem('user'))
    session.user.type = 1
    localStorage.setItem('user', JSON.stringify(session))
  })
  await page.goto(`${baseURL}/admin/team`)
  await page.locator('.action-list-trigger').click()
  const downloaded = page.waitForEvent('download')
  await page
    .locator('.action-list-body button')
    .filter({ hasText: /download/i })
    .click()
  const download = await downloaded
  const chunks = []
  for await (const chunk of await download.createReadStream()) chunks.push(chunk)
  const sheet = XLSX.read(Buffer.concat(chunks)).Sheets.Teams
  expect(sheet.A1.v).toContain('This data is for all industries.')
  expect(sheet.A3.v).toBe('Title')
  expect(sheet['!merges']).toEqual([{ s: { r: 0, c: 0 }, e: { r: 1, c: 10 } }])
})
