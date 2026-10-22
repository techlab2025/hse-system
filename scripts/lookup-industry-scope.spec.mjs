import { test, expect } from '@playwright/test'
import { readdirSync } from 'node:fs'
import * as XLSX from 'xlsx'
import { installFixtures } from '../src/features/Organization/Project/tests/project-fixtures.mjs'

const baseURL = process.env.PROJECT_TEST_URL || 'http://127.0.0.1:5173'
const lookupDirectories = [
  ...[
    'PPEActivity',
    'PPETool',
    'DocumentCategory',
    'AuditStandard',
    'AuditActivity',
    'ppeItem',
    'VisitActivity',
    'VisitTheme',
    'VisitCategory',
    'DrillType',
    'WhereHouseType',
    'Injury',
    'MeetingType',
    'PTWType',
    'MangementChangeTopicType',
    'TraningTopic',
  ].map((name) => `Organization/${name}`),
  ...[
    'HazardType',
    'AccidentsTypes',
    'ObserverationType',
    'EquipmentType',
    'RootCauses',
    'Teams',
    'Equipment',
    'FactoryItem',
    'Factory',
    'IncidentCategories',
  ].map((name) => `setting/${name}`),
]

test('all lookup Excel serializers attach industry scope to every row', async ({ page }) => {
  await installFixtures(page)
  await page.goto(`${baseURL}/organization`)
  const files = lookupDirectories.flatMap((directory) => {
    const folder = `src/features/${directory}/Core/params`
    return readdirSync(new URL(`../${folder}`, import.meta.url))
      .filter((name) => /excelparams\.ts$/i.test(name))
      .map((name) => `${folder}/${name}`)
  })
  expect(files).toHaveLength(26)
  const results = await page.evaluate(async (files) => {
    const results = []
    for (const file of files) {
      const Params = (await import(`/${file}`)).default
      const data = [1, 2].map((id) => ({
        title: `Title ${id}`,
        name: `Equipment ${id}`,
        factory_id: 5,
        equipment_type_id: 1,
      }))
      for (const scope of [
        undefined,
        { all_industries: 1, industry_ids: [22] },
        { all_industries: 0, industry_ids: [22, 22, 31] },
      ]) {
        const argument = file.includes('/FactoryItem/') ? data : { data }
        const payload = new Params(argument, scope).toMap()
        results.push({ file, scope, payload })
      }
    }
    return results
  }, files)
  for (const { file, scope, payload } of results) {
    const rows = payload.data ?? payload.equipments_data
    expect(rows, file).toHaveLength(2)
    expect(payload, file).not.toHaveProperty('all_industries')
    expect(payload, file).not.toHaveProperty('industry_ids')
    for (const row of rows) {
      if (!scope) {
        expect(row, file).not.toHaveProperty('all_industries')
        expect(row, file).not.toHaveProperty('industry_ids')
      } else {
        expect(row.all_industries, file).toBe(scope.all_industries)
        expect(row.industry_ids, file).toEqual(scope.all_industries ? [] : [22, 31])
      }
    }
  }
})

for (const feature of [
  { path: 'ppe-tools', fetch: 'fetch_ppe_tools', create: 'create_ppe_tool' },
  { path: 'visit-activities', fetch: 'fetch_visit_activities', create: 'create_visit_activity' },
  {
    path: 'meeting-types',
    fetch: 'fetch_meeting_types',
    create: 'create_meeting_type',
    fields: { periodic_type: 2, number_of_days: 6 },
  },
]) {
  for (const allIndustries of [true, false]) {
    test(`admin ${feature.path} imports every row for ${allIndustries ? 'all industries' : 'selected industries'}`, async ({
      page,
    }) => {
      await installFixtures(page)
      await page.addInitScript(() => {
        const session = JSON.parse(localStorage.getItem('user'))
        session.user.type = 1
        localStorage.setItem('user', JSON.stringify(session))
      })
      const calls = []
      await page.route(`**/${feature.fetch}`, (route) =>
        route.fulfill({
          json: {
            status: true,
            data: {
              data: [{ id: 1, title: 'Existing' }],
              meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
            },
          },
        }),
      )
      await page.route('**/fetch_industries', (route) =>
        route.fulfill({
          json: {
            status: true,
            data: {
              data: [{ id: 22, title: 'Construction' }],
              meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
            },
          },
        }),
      )
      await page.route(`**/${feature.create}`, (route) => {
        calls.push(route.request().postDataJSON())
        return route.fulfill({
          json: { status: true, message: 'Imported', data: { id: 2, title: 'First' } },
        })
      })
      await page.goto(`${baseURL}/admin/${feature.path}`)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.aoa_to_sheet([
          ['Title', ...Object.keys(feature.fields ?? {})],
          ...['First', 'Second'].map((title) => [title, ...Object.values(feature.fields ?? {})]),
        ]),
        'Lookup',
      )
      await page
        .locator('input[type=file][accept=".xls,.xlsx"]')
        .first()
        .setInputFiles({
          name: 'lookup.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
        })
      const scope = page.locator('.lookup-excel-industry-scope')
      await expect(scope).toBeVisible()
      await expect(scope.locator('input[type=checkbox]')).toBeChecked()
      if (!allIndustries) {
        await scope.locator('.checkbox-label').click()
        await page.locator('.btn-confirm').click()
        await expect(page.locator('.dialog-error[open]')).toContainText(
          'Select at least one industry',
        )
        expect(calls).toHaveLength(0)
        await page.locator('.dialog-error button').click()
        await scope.locator('.p-multiselect').click()
        await page.getByRole('option', { name: 'Construction', exact: true }).click()
        await page.keyboard.press('Escape')
      }
      await page.locator('.btn-confirm').click()
      await expect
        .poll(() => calls)
        .toEqual([
          {
            data: ['First', 'Second'].map((title) => ({
              title,
              ...feature.fields,
              all_industries: allIndustries ? 1 : 0,
              industry_ids: allIndustries ? [] : [22],
            })),
          },
        ])
    })
  }
}

test('organization uploads hide industry controls and keep their existing payload', async ({
  page,
}) => {
  await installFixtures(page)
  const calls = []
  await page.route('**/create_ppe_tool', (route) => {
    calls.push(route.request().postDataJSON())
    return route.fulfill({ json: { status: true, message: 'Imported' } })
  })
  await page.goto(`${baseURL}/organization/ppe-tools`)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['Title'], ['First']]), 'Lookup')
  await page
    .locator('input[type=file][accept=".xls,.xlsx"]')
    .first()
    .setInputFiles({
      name: 'lookup.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
    })
  await expect(page.locator('.btn-confirm')).toBeVisible()
  await expect(page.locator('.lookup-excel-industry-scope')).toHaveCount(0)
  await page.locator('.btn-confirm').click()
  await expect.poll(() => calls).toEqual([{ data: [{ title: 'First' }] }])
})
