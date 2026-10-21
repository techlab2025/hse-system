// Run with the local Vite server: node src/features/Organization/TraningTopic/tests/actions-excel.test.mjs
// Every API call is mocked, including writes.
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import * as XLSX from 'xlsx'
import { installFixtures } from '../../Project/tests/project-fixtures.mjs'
const baseURL = process.env.TRAINING_TEST_URL || 'http://127.0.0.1:5190'
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] })
const file = (rows, ext = 'xlsx') => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Topics')
  return {
    name: `training.${ext}`,
    mimeType: 'application/octet-stream',
    buffer: XLSX.write(workbook, { type: 'buffer', bookType: ext === 'xls' ? 'biff8' : 'xlsx' }),
  }
}
async function setup({
  admin = false,
  readOnly = false,
  path = 'traning-topics',
  savedAll = '0',
} = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const requests = []
  const errors = []
  let fail = false
  page.on('pageerror', (error) => errors.push(error.message))
  await installFixtures(page)
  await page.addInitScript(
    ({ admin, readOnly }) => {
      const state = JSON.parse(localStorage.getItem('user'))
      state.user.type = admin ? 1 : 2
      if (readOnly) {
        state.user.isMaster = 0
        state.user.permission = ['OTRTP01']
      }
      localStorage.setItem('user', JSON.stringify(state))
    },
    { admin, readOnly },
  )
  await page.route('https://api.hse.techlabeg.com/**', async (route) => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop()
    let body = {}
    try {
      body = route.request().postDataJSON() || {}
    } catch {
      /* details use multipart */
    }
    requests.push({ endpoint, body })
    let data = []
    if (endpoint === 'fetch_training_topics')
      data = {
        data: [{ id: 17, title: 'Working at height' }],
        meta: {
          current_page: body.page || 1,
          last_page: 2,
          per_page: 10,
          total: 11,
          from: 1,
          to: 1,
        },
      }
    if (endpoint === 'fetch_languages')
      data = [
        { id: 1, code: 'en', title: 'English' },
        { id: 2, code: 'ar', title: 'Arabic' },
      ]
    if (endpoint === 'fetch_training_topic_details')
      data = {
        id: 17,
        titles: [{ locale: 'en', title: 'Working at height' }],
        all_industries: savedAll,
        industries: [],
      }
    if (endpoint === 'create_training_topic' && fail)
      return route.fulfill({
        status: 422,
        json: { message: 'Training import rejected', status: false },
      })
    return route.fulfill({ json: { status: true, data, message: 'OK' } })
  })
  await page.goto(`${baseURL}/${admin ? 'admin' : 'organization'}/${path}`)
  return {
    page,
    requests,
    errors,
    setFailure: (value) => {
      fail = value
    },
  }
}
try {
  const { page, requests, errors, setFailure } = await setup()
  await page.getByRole('link', { name: 'Add training topic', exact: true }).waitFor()
  await page.locator('.main-content .action-list-trigger').click()
  const templatePromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Excel template', exact: true }).click()
  const template = await templatePromise
  assert.equal(template.suggestedFilename(), 'traning_topic_template.xlsx')
  const templateBook = XLSX.read(await readFile(await template.path()), { type: 'buffer' })
  assert.deepEqual(
    XLSX.utils.sheet_to_json(templateBook.Sheets[templateBook.SheetNames[0]], { header: 1 })[0],
    ['title'],
  )
  const exportedPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export To Excel', exact: true }).click()
  const exported = await exportedPromise
  const exportedBook = XLSX.read(await readFile(await exported.path()), { type: 'buffer' })
  assert.deepEqual(XLSX.utils.sheet_to_json(exportedBook.Sheets[exportedBook.SheetNames[0]]), [
    { title: 'Working at height' },
  ])
  assert.equal(await page.locator('.export-pdf-btn').count(), 1)
  const chooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Upload completed template', exact: true }).click()
  const chooser = await chooserPromise
  await chooser.setFiles(file([{ Name: 'Working safely' }, { Name: 'Remove me' }], 'xls'))
  await page.getByRole('dialog', { name: 'Map Excel Columns', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Confirm Mapping', exact: true }).click()
  await page.getByRole('heading', { name: 'Mapped data preview', exact: true }).waitFor()
  await page.locator('.excel-rows-import').getByTitle('Delete row', { exact: true }).last().click()
  setFailure(true)
  await page
    .locator('.excel-rows-import')
    .getByRole('button', { name: 'Confirm and submit', exact: true })
    .click()
  await page.getByRole('alert').filter({ hasText: 'Training import rejected' }).waitFor()
  assert.equal(await page.locator('.excel-rows-import tbody tr').count(), 1)
  assert.deepEqual(requests.find((request) => request.endpoint === 'create_training_topic').body, {
    data: [{ title: 'Working safely' }],
  })
  await page.locator('dialog.dialog-error[open]').getByRole('button').click()
  setFailure(false)
  await page
    .locator('.excel-rows-import')
    .getByRole('button', { name: 'Confirm and submit', exact: true })
    .click()
  await page.waitForFunction(() => !document.querySelector('.excel-rows-import'))
  assert.equal(new URL(page.url()).pathname, '/organization/traning-topics')
  assert.ok(requests.filter((request) => request.endpoint === 'fetch_training_topics').length >= 2)
  assert.deepEqual(errors, [])
  await page.close()

  const readOnly = await setup({ readOnly: true })
  await readOnly.page.locator('.main-table tbody tr').waitFor()
  assert.equal(
    await readOnly.page.getByRole('link', { name: 'Add training topic', exact: true }).count(),
    0,
  )
  await readOnly.page.locator('.main-content .action-list-trigger').click()
  await readOnly.page.getByRole('button', { name: 'Export To Excel', exact: true }).waitFor()
  assert.equal(
    await readOnly.page
      .getByRole('button', { name: 'Upload completed template', exact: true })
      .count(),
    0,
  )
  assert.equal(
    await readOnly.page
      .getByRole('button', { name: 'Download Excel template', exact: true })
      .count(),
    0,
  )
  await readOnly.page.close()

  const standalone = await setup({ path: 'traning-topic/upload-excel' })
  await standalone.page
    .locator('input[type=file]')
    .setInputFiles(file([{ title: 'Standalone topic' }]))
  await standalone.page.getByRole('heading', { name: 'Mapped data preview', exact: true }).waitFor()
  assert.deepEqual(standalone.errors, [])
  await standalone.page.close()
  for (const all of ['0', '1']) {
    const edit = await setup({ admin: true, path: 'traning-topic/17', savedAll: all })
    await edit.page.locator('#title-3').waitFor({ state: 'attached' })
    assert.equal(await edit.page.locator('#title-3').isChecked(), all === '1')
    await edit.page.locator('label[for="title-3"]').click()
    const response = edit.page.waitForResponse((response) =>
      response.url().endsWith('update_training_topic'),
    )
    await edit.page.getByRole('button', { name: 'Save', exact: true }).click()
    await response
    assert.equal(
      edit.requests.find((request) => request.endpoint === 'update_training_topic').body
        .all_industries,
      all === '0' ? 1 : 0,
    )
    assert.deepEqual(edit.errors, [])
    await edit.page.close()
  }
  const admin = await setup({ admin: true })
  await admin.page.getByRole('link', { name: 'Add training topic', exact: true }).waitFor()
  assert.equal(
    await admin.page
      .getByRole('link', { name: 'Add training topic', exact: true })
      .getAttribute('href'),
    '/admin/traning-topics/add',
  )
  await admin.page.setViewportSize({ width: 390, height: 844 })
  await admin.page.locator('.main-content .action-list-trigger').click()
  await admin.page.getByRole('button', { name: 'Download Excel template', exact: true }).waitFor()
  assert.deepEqual(admin.errors, [])
  await admin.page.close()
  console.log(
    'Training Topic checks passed: actions, title-only XLSX downloads, XLS import/mapping/row removal, failed-import retry, list refresh, standalone upload, permissions, industry flags and mobile/admin routes.',
  )
} finally {
  await browser.close()
}
