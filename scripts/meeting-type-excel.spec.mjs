import { test, expect } from '@playwright/test'
import * as XLSX from 'xlsx'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const workbookBuffer = (rows) => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'Meeting Types')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
const fileInput = (page) => page.locator('input[type=file][accept=".xls,.xlsx"]').first()
async function setup(page, admin = false, fail = false) {
  await installFixtures(page)
  if (admin)
    await page.addInitScript(() => {
      const session = JSON.parse(localStorage.getItem('user'))
      session.user.type = 1
      localStorage.setItem('user', JSON.stringify(session))
    })
  const calls = []
  let fetches = 0
  await page.route('**/fetch_meeting_types', async (route) => {
    fetches++
    await route.fulfill({
      json: {
        status: true,
        data: {
          data: [
            {
              id: 1,
              title: 'Weekly review',
              periodic_type: 2,
              number_of_days: 1,
              all_industries: 0,
              industries: [{ id: 7, title: 'Construction' }],
            },
          ],
          meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
        },
      },
    })
  })
  await page.route('**/create_meeting_type', async (route) => {
    calls.push(route.request().postDataJSON())
    await route.fulfill({
      status: fail ? 500 : 200,
      json: fail
        ? { message: 'Import failed', status: false }
        : {
            status: true,
            data: { id: 2, title: 'Imported meeting', periodic_type: 2, number_of_days: 6 },
          },
    })
  })
  // Inspect the actual workbook Blob without depending on the browser download filesystem.
  await page.addInitScript(() => {
    const create = URL.createObjectURL.bind(URL)
    const blobs = new Map()
    window.__meetingDownloads = []
    URL.createObjectURL = (blob) => {
      const url = create(blob)
      blobs.set(url, blob)
      return url
    }
    const click = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function () {
      if (this.download.endsWith('.xlsx') && blobs.has(this.href)) {
        window.__meetingDownloads.push({ name: this.download, blob: blobs.get(this.href) })
        return
      }
      return click.call(this)
    }
  })
  await page.goto(`${baseURL}/${admin ? 'admin' : 'organization'}/meeting-types`, {
    waitUntil: 'domcontentloaded',
  })
  await expect(page.locator('.main-table tbody tr')).toHaveCount(1)
  return { calls, fetches: () => fetches }
}

test('template generation, automatic preview, row removal, submit and refresh', async ({
  page,
}) => {
  page.setDefaultTimeout(15000)
  const state = await setup(page)
  await expect(page.locator('.main-table tbody tr td').nth(3)).toHaveText('1')
  await page.locator('.action-list-trigger').click()
  await page.getByRole('button', { name: /download excel template/i }).click()
  const file = await page.evaluate(async () => {
    const download = window.__meetingDownloads.at(-1)
    return {
      name: download.name,
      bytes: Array.from(new Uint8Array(await download.blob.arrayBuffer())),
    }
  })
  expect(file.name).toBe('meeting_type_template.xlsx')
  const workbook = XLSX.read(Buffer.from(file.bytes), { type: 'buffer' })
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    header: 1,
    defval: '',
  })
  expect(rows[0]).toEqual(['title', 'periodic_type', 'number_of_days'])
  await page.keyboard.press('Escape')
  await fileInput(page).setInputFiles({
    name: 'meeting-template.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: workbookBuffer(rows),
  })
  await expect(page.locator('.meeting-type-excel-import .table-badge')).toHaveText('2 rows')
  await expect(page.getByRole('button', { name: 'Confirm Mapping', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Delete row 1', exact: true }).click()
  await expect(page.locator('.meeting-type-excel-import .table-badge')).toHaveText('1 rows')
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
  }
  await page.getByRole('button', { name: 'Confirm & Submit', exact: true }).click()
  await expect(page.locator('.meeting-type-excel-import')).toHaveCount(0)
  expect(state.calls).toEqual([
    { data: [{ title: 'Weekly safety meeting', periodic_type: 2, number_of_days: 6 }] },
  ])
  expect(state.fetches()).toBeGreaterThan(1)
})

test('custom column mapping validates the form periodic rules before sending', async ({ page }) => {
  const state = await setup(page)
  await fileInput(page).setInputFiles({
    name: 'custom.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: workbookBuffer([
      ['Meeting', 'Frequency', 'Days'],
      ['Invalid weekly', 2, 7],
    ]),
  })
  await page.getByRole('button', { name: 'Confirm Mapping', exact: true }).click()
  await expect(page.locator('.meeting-type-excel-import .table-badge')).toHaveText('1 rows')
  await page.getByRole('button', { name: 'Confirm & Submit', exact: true }).click()
  await expect(page.locator('.meeting-type-excel-import [role=alert]')).toContainText('less than 7')
  expect(state.calls).toHaveLength(0)
})

test('admin template includes form industry fields and submits selected industry IDs', async ({
  page,
}) => {
  const state = await setup(page, true)
  await page.locator('.action-list-trigger').click()
  await page.getByRole('button', { name: /download excel template/i }).click()
  const file = await page.evaluate(async () => {
    const download = window.__meetingDownloads.at(-1)
    return {
      name: download.name,
      bytes: Array.from(new Uint8Array(await download.blob.arrayBuffer())),
    }
  })
  expect(file.name).toBe('meeting_type_template.xlsx')
  const workbook = XLSX.read(Buffer.from(file.bytes), { type: 'buffer' })
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    header: 1,
    defval: '',
  })
  expect(rows[0]).toEqual([
    'title',
    'periodic_type',
    'number_of_days',
    'all_industries',
    'industry_ids',
  ])
  await page.keyboard.press('Escape')
  await fileInput(page).setInputFiles({
    name: 'admin.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: workbookBuffer([rows[0], ['Scoped meeting', 2, 1, 0, '7,8']]),
  })
  await expect(page.locator('.meeting-type-excel-import .table-badge')).toHaveText('1 rows')
  await page.getByRole('button', { name: 'Confirm & Submit', exact: true }).click()
  await expect(page.locator('.meeting-type-excel-import')).toHaveCount(0)
  expect(state.calls).toEqual([
    {
      data: [
        {
          title: 'Scoped meeting',
          periodic_type: 2,
          number_of_days: 1,
          all_industries: 0,
          industry_ids: [7, 8],
        },
      ],
    },
  ])
})

test('failed uploads keep the preview available for correction or retry', async ({ page }) => {
  const state = await setup(page, false, true)
  await fileInput(page).setInputFiles({
    name: 'retry.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: workbookBuffer([
      ['title', 'periodic_type', 'number_of_days'],
      ['Weekly meeting', 2, 6],
    ]),
  })
  await page.getByRole('button', { name: 'Confirm & Submit', exact: true }).click()
  await expect.poll(() => state.calls.length).toBe(1)
  await expect(page.locator('.meeting-type-excel-import .table-badge')).toHaveText('1 rows')
  await expect(page.getByRole('button', { name: 'Confirm & Submit', exact: true })).toBeEnabled()
})
