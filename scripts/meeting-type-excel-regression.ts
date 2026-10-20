import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as XLSX from 'xlsx'
import {
  buildMeetingTypeExcelRows,
  meetingTypeExcelFields,
  meetingTypeTemplateRows,
  meetingTypeExportRows,
} from '../src/features/Organization/MeetingType/Presentation/utils/meetingTypeExcel'
import MeetingTypeModel from '../src/features/Organization/MeetingType/Data/models/MeetingTypeModel'

test('downloaded templates round trip for organization and admin', () => {
  for (const admin of [false, true]) {
    const worksheet = XLSX.utils.json_to_sheet(meetingTypeTemplateRows(admin), {
      header: meetingTypeExcelFields(admin),
    })
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as string[][]
    assert.deepEqual(data[0], meetingTypeExcelFields(admin))
    const rows = buildMeetingTypeExcelRows(data, admin)
    assert.equal(rows.length, 2)
    assert.equal(rows[0].number_of_days, null)
    assert.equal(rows[1].number_of_days, 6)
    assert.equal(rows[0].all_industries, admin ? 1 : undefined)
    assert.equal('description' in rows[0], false)
  }
})
test('the form periodic limits and daily normalization apply to every row', () => {
  for (const [type, max] of [
    [2, 6],
    [3, 29],
    [4, 364],
    [5, 3650],
  ]) {
    assert.equal(
      buildMeetingTypeExcelRows(
        [
          ['title', 'periodic_type', 'number_of_days'],
          ['Test', type, max],
        ],
        false,
      )[0].number_of_days,
      max,
    )
    if (type !== 5)
      assert.throws(
        () =>
          buildMeetingTypeExcelRows(
            [
              ['title', 'periodic_type', 'number_of_days'],
              ['Test', type, max + 1],
            ],
            false,
          ),
        /Excel row 2/,
      )
  }
  assert.equal(
    buildMeetingTypeExcelRows(
      [
        ['title', 'periodic_type', 'number_of_days'],
        ['Daily', 1, 99],
      ],
      false,
    )[0].number_of_days,
    null,
  )
  for (const days of ['', 'NaN', -2, 1.5])
    assert.throws(
      () =>
        buildMeetingTypeExcelRows(
          [
            ['title', 'periodic_type', 'number_of_days'],
            ['Test', 2, days],
          ],
          false,
        ),
      /positive integer/,
    )
})
test('admin scope matches the form and organization imports omit admin fields', () => {
  const data = [
    ['title', 'periodic_type', 'all_industries', 'industry_ids'],
    ['Test', 1, 'no', '2,3,2'],
  ]
  assert.deepEqual(buildMeetingTypeExcelRows(data, true)[0].industry_ids, [2, 3])
  assert.deepEqual(buildMeetingTypeExcelRows(data, false)[0], {
    title: 'Test',
    periodic_type: 1,
    number_of_days: null,
  })
  assert.equal(
    buildMeetingTypeExcelRows([data[0], ['Test', 1, 1, 'unused']], true)[0].industry_ids,
    undefined,
  )
  assert.throws(
    () => buildMeetingTypeExcelRows([data[0], ['Test', 1, 0, 'bad']], true),
    /Industry IDs/,
  )
  assert.throws(
    () => buildMeetingTypeExcelRows([data[0], ['Test', 1, 'unknown', '']], true),
    /All industries/,
  )
})
test('normalized and reordered headers work; missing fields, duplicate columns and empty sheets fail', () => {
  assert.deepEqual(
    buildMeetingTypeExcelRows(
      [
        ['periodicType', 'Meeting Type Title', 'Number Of Days'],
        ['weekly', ' Safety ', 1],
      ],
      false,
    )[0],
    { title: 'Safety', periodic_type: 2, number_of_days: 1 },
  )
  assert.throws(
    () =>
      buildMeetingTypeExcelRows(
        [
          ['title', 'periodic_type'],
          ['', 1],
        ],
        false,
      ),
    /title is required/,
  )
  assert.throws(
    () =>
      buildMeetingTypeExcelRows(
        [
          ['title', 'periodic_type'],
          ['Test', 'invalid'],
        ],
        false,
      ),
    /Periodic type/,
  )
  assert.throws(() => buildMeetingTypeExcelRows([['title', 'title']], false), /unique/)
  assert.throws(
    () =>
      buildMeetingTypeExcelRows(
        [
          ['title', 'periodic_type'],
          ['', ''],
        ],
        false,
      ),
    /At least one/,
  )
})
test('export preserves daily and one-day weekly values and admin industry selections', () => {
  const models = [
    MeetingTypeModel.fromMap({
      id: 1,
      title: 'Daily',
      periodic_type: 1,
      number_of_days: null,
      all_industries: 1,
    }),
    MeetingTypeModel.fromMap({
      id: 2,
      title: 'Weekly',
      periodic_type: 2,
      number_of_days: 1,
      all_industries: 0,
      industries: [{ id: 7, title: 'Safety' }],
    }),
  ]
  const rows = meetingTypeExportRows(models, true)
  assert.equal(rows[0].number_of_days, '')
  assert.equal(rows[1].number_of_days, 1)
  assert.equal(rows[1].industry_ids, '7')
  assert.equal(rows[0].all_industries, 1)
})
