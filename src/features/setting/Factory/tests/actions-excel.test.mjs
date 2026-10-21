// Run: node src/features/setting/Factory/tests/actions-excel.test.mjs
// All API requests, including creates and deletes, are mocked.
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import * as XLSX from 'xlsx'
import { installFixtures } from '../../../Organization/Project/tests/project-fixtures.mjs'

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] })
const baseURL = process.env.FACTORY_TEST_URL || 'http://127.0.0.1:5190'
const payload = (rows, ext = 'xlsx') => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Data')
  return {
    name: `rows.${ext}`,
    mimeType: 'application/octet-stream',
    buffer: XLSX.write(workbook, { type: 'buffer', bookType: ext === 'xls' ? 'biff8' : 'xlsx' }),
  }
}
async function openPage(path, { admin = false, readOnly = false } = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const requests = []
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await installFixtures(page)
  if (admin)
    await page.addInitScript(() => {
      const state = JSON.parse(localStorage.getItem('user'))
      state.user.type = 1
      localStorage.setItem('user', JSON.stringify(state))
    })
  if (readOnly)
    await page.addInitScript(
      (permission) => {
        const state = JSON.parse(localStorage.getItem('user'))
        state.user.isMaster = 0
        state.user.permission = [permission]
        localStorage.setItem('user', JSON.stringify(state))
      },
      path === 'factory' ? 'OF01' : 'OFI01',
    )
  let itemAttempts = 0
  let failItemTitle = ''
  await page.route('https://api.hse.techlabeg.com/**', async (route) => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop()
    const body = route.request().postDataJSON() || {}
    requests.push({ endpoint, body })
    const factory = { id: 7, title: 'Electrical factors', all_industries: 1, industries: [] }
    const item = {
      id: 12,
      title: 'Live wires',
      titles: [{ locale: 'en', title: 'Live wires' }],
      all_industries: 1,
      factory: { ...factory, titles: [{ locale: 'en', title: factory.title }] },
      industries: [],
    }
    factory.titles = [{ locale: 'en', title: factory.title }]
    let data = []
    if (endpoint === 'fetch_factories' || endpoint === 'fetch_factory_items')
      data = {
        data: [endpoint === 'fetch_factories' ? factory : item],
        meta: {
          current_page: body.page || 1,
          last_page: 1,
          per_page: 10,
          total: 1,
          from: 1,
          to: 1,
        },
      }
    if (endpoint === 'create_factory_item') {
      itemAttempts++
      if (body.data?.some((row) => row.title === failItemTitle))
        return route.fulfill({ status: 422, json: { status: false, message: 'Test row rejected' } })
      data = item
    }
    if (
      endpoint === 'create_factory' ||
      endpoint === 'fetch_factory_details' ||
      endpoint === 'update_factory'
    )
      data = factory
    if (endpoint === 'fetch_factory_item_details' || endpoint === 'update_factory_item') data = item
    if (endpoint === 'fetch_languages')
      data = [
        { id: 1, code: 'en', title: 'English' },
        { id: 2, code: 'ar', title: 'Arabic' },
      ]
    return route.fulfill({ json: { status: true, data, message: 'OK' } })
  })
  await page.goto(`${baseURL}/${admin ? 'admin' : 'organization'}/${path}`)
  if (path.includes('/')) await page.locator('form .lang-input').waitFor()
  else await page.locator('.main-table tbody tr').first().waitFor()
  return {
    page,
    requests,
    errors,
    setFailure: (title) => {
      failItemTitle = title
    },
    getAttempts: () => itemAttempts,
  }
}
const openMenu = (page) => page.locator('.main-content .action-list-trigger').first().click()
const importFile = async (page, file) => {
  await page.locator('input[type=file]').first().setInputFiles(file)
  await page.getByRole('heading', { name: 'Mapped data preview', exact: true }).waitFor()
}
try {
  const { page, requests, errors } = await openPage('factory')
  await page.getByRole('link', { name: 'Add Factor', exact: true }).waitFor()
  await openMenu(page)
  const templatePromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Excel template', exact: true }).click()
  const template = await templatePromise
  assert.equal(template.suggestedFilename(), 'factors_template.xlsx')
  const workbook = XLSX.read(await readFile(await template.path()), { type: 'buffer' })
  assert.deepEqual(
    XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0],
    ['title'],
  )
  const exportPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export To Excel', exact: true }).click()
  const exported = await exportPromise
  const exportedBook = XLSX.read(await readFile(await exported.path()), { type: 'buffer' })
  assert.equal(XLSX.utils.sheet_to_json(exportedBook.Sheets[exportedBook.SheetNames[0]])[0].id, 7)
  await page.keyboard.press('Escape')
  await importFile(page, payload([{ title: 'Factor A' }, { title: 'Delete this row' }], 'xls'))
  const preview = page.locator('.excel-rows-import')
  await preview.getByTitle('Delete row', { exact: true }).last().click()
  await preview.getByRole('button', { name: 'Confirm and submit', exact: true }).click()
  await page.waitForFunction(() => !document.querySelector('.excel-rows-import'))
  assert.deepEqual(requests.find((r) => r.endpoint === 'create_factory').body, {
    data: [{ title: 'Factor A' }],
  })
  assert.equal(new URL(page.url()).pathname, '/organization/factory')
  assert.deepEqual(errors, [])
  await page
    .locator('input[type=file]')
    .first()
    .setInputFiles(payload([{ Name: 'Mapped factor' }]))
  await page.getByRole('dialog', { name: 'Map Excel Columns', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Confirm Mapping', exact: true }).click()
  await page.getByRole('heading', { name: 'Mapped data preview', exact: true }).waitFor()
  await page
    .locator('.excel-rows-import')
    .getByRole('button', { name: 'Confirm and submit', exact: true })
    .click()
  await page.waitForFunction(() => !document.querySelector('.excel-rows-import'))
  assert.deepEqual(requests.filter((r) => r.endpoint === 'create_factory').at(-1).body, {
    data: [{ title: 'Mapped factor' }],
  })
  await page.close()

  const items = await openPage('factories-items')
  await items.page.getByRole('link', { name: 'Add Factor Item', exact: true }).waitFor()
  await openMenu(items.page)
  const itemTemplatePromise = items.page.waitForEvent('download')
  await items.page.getByRole('button', { name: 'Download Excel template', exact: true }).click()
  const itemTemplate = await itemTemplatePromise
  const itemBook = XLSX.read(await readFile(await itemTemplate.path()), { type: 'buffer' })
  assert.deepEqual(
    XLSX.utils.sheet_to_json(itemBook.Sheets[itemBook.SheetNames[0]], { header: 1 })[0],
    ['title'],
  )
  await items.page.keyboard.press('Escape')
  await importFile(
    items.page,
    payload([{ title: 'First imported item' }, { title: 'Retry this item' }]),
  )
  const submitItems = () =>
    items.page
      .locator('.excel-rows-import')
      .getByRole('button', { name: 'Confirm and submit', exact: true })
      .click()
  await submitItems()
  await items.page
    .getByRole('alert')
    .filter({ hasText: 'Select a factor for these items.' })
    .waitFor()
  assert.equal(items.getAttempts(), 0)
  const factorSelect = items.page.locator('.factor-item-import-factor').getByRole('combobox')
  await factorSelect.click()
  await items.page.getByRole('option', { name: 'Electrical factors', exact: true }).click()
  const selectorTop = await items.page.locator('.factor-item-import-factor').boundingBox()
  const previewTable = await items.page.locator('.excel-rows-import table').boundingBox()
  assert.ok(selectorTop.y < previewTable.y)
  items.setFailure('Retry this item')
  await submitItems()
  await items.page.getByRole('alert').filter({ hasText: 'Test row rejected' }).waitFor()
  assert.equal(items.getAttempts(), 1)
  assert.deepEqual(items.requests.filter((r) => r.endpoint === 'create_factory_item')[0].body, {
    data: [
      { title: 'First imported item', factory_id: 7 },
      { title: 'Retry this item', factory_id: 7 },
    ],
  })
  assert.equal(await items.page.locator('.excel-rows-import tbody tr').count(), 2)
  items.setFailure('')
  await submitItems()
  await items.page.waitForFunction(() => !document.querySelector('.excel-rows-import'))
  assert.equal(items.getAttempts(), 2)
  assert.equal(new URL(items.page.url()).pathname, '/organization/factories-items')
  assert.deepEqual(items.errors, [])
  await items.page.close()

  // Checkbox must update the payload even when it is the last edited field.
  for (const feature of ['factory', 'factory-item']) {
    for (const all of [true, false]) {
      const form = await openPage(`${feature}/add`, { admin: true })
      await form.page.locator('.lang-input').fill('Manual factor title')
      if (feature === 'factory-item') {
        await form.page.getByRole('combobox').last().click()
        await form.page.getByRole('option', { name: 'Electrical factors', exact: true }).click()
      }
      const checkbox = form.page.locator('#title-3')
      await form.page.locator('label[for="title-3"]').click()
      if (!all) await form.page.locator('label[for="title-3"]').click()
      assert.equal(await checkbox.isChecked(), all)
      const endpoint = feature === 'factory' ? 'create_factory' : 'create_factory_item'
      const response = form.page.waitForResponse((r) => r.url().endsWith(endpoint))
      await form.page.getByRole('button', { name: 'Save', exact: true }).click()
      await response
      const request = form.requests.find((r) => r.endpoint === endpoint)
      assert.equal(request.body.all_industries, all ? 1 : 0)
      assert.equal('industry_ids' in request.body, !all)
      assert.deepEqual(form.errors, [])
      await form.page.close()
    }
    const edit = await openPage(`${feature}/${feature === 'factory' ? 7 : 12}`, { admin: true })
    assert.equal(await edit.page.locator('#title-3').isChecked(), true)
    await edit.page.locator('label[for="title-3"]').click()
    await edit.page.locator('label[for="title-3"]').click()
    const endpoint = feature === 'factory' ? 'update_factory' : 'update_factory_item'
    const response = edit.page.waitForResponse((r) => r.url().endsWith(endpoint))
    await edit.page.getByRole('button', { name: 'Save', exact: true }).click()
    await response
    assert.equal(edit.requests.find((r) => r.endpoint === endpoint).body.all_industries, 1)
    assert.deepEqual(edit.errors, [])
    await edit.page.close()
  }
  for (const path of ['factory', 'factories-items']) {
    const admin = await openPage(path, { admin: true })
    const add = admin.page.getByRole('link', {
      name: path === 'factory' ? 'Add Factor' : 'Add Factor Item',
      exact: true,
    })
    assert.equal(
      await add.getAttribute('href'),
      `/admin/${path === 'factory' ? 'factory' : 'factory-item'}/add`,
    )
    await admin.page.setViewportSize({ width: 390, height: 844 })
    await openMenu(admin.page)
    await admin.page.getByRole('button', { name: 'Download Excel template', exact: true }).waitFor()
    assert.deepEqual(admin.errors, [])
    await admin.page.close()
  }
  for (const path of ['factory', 'factories-items']) {
    const readOnly = await openPage(path, { readOnly: true })
    assert.equal(
      await readOnly.page
        .getByRole('link', {
          name: path === 'factory' ? 'Add Factor' : 'Add Factor Item',
          exact: true,
        })
        .count(),
      0,
    )
    await openMenu(readOnly.page)
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
    assert.deepEqual(readOnly.errors, [])
    await readOnly.page.close()
  }
  console.log(
    'Factory and Factory Item checks passed: matching actions, XLSX downloads, XLS import/preview/delete, bulk factors, title-only item bulk payload, factor selection, failed-batch retry, create/edit all-industry flags, admin and organization routes, mobile.',
  )
} finally {
  await browser.close()
}
