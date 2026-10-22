import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import {
  createLookupExcelBuffer,
  lookupExcelHints,
  lookupExcelHintText,
  readLookupRows,
} from '../src/shared/utils/lookupExcel'
import AddPPEToolExcelParams from '../src/features/Organization/PPETool/Core/params/addPPEToolExcelParams'

test('capitalized Title headers produce title values in the upload payload', () => {
  for (const input of [
    [['Title'], ['Safety helmet']],
    [['  TITLE  '], ['Safety helmet']],
    [['Instructions edited in Excel'], ['Fill the Title column'], ['Title'], ['Safety helmet']],
    [[lookupExcelHintText.replace(/\n/g, '\r\n')], [], ['Title'], ['Safety helmet']],
  ]) {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(input), 'Upload')
    // Reading a real XLSX populates cached cell.w values used by raw:false upload readers.
    const sheet = XLSX.read(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })).Sheets
      .Upload!
    const [headers, ...rows] = readLookupRows<string[]>(sheet, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: false,
    })
    const data = rows.map((row) => {
      const fields = Object.fromEntries(headers!.map((key, index) => [key, row[index]]))
      return { title: String(fields.title ?? '') }
    })
    assert.deepEqual(new AddPPEToolExcelParams({ data }).toMap(), {
      data: [{ title: 'Safety helmet' }],
    })
  }
})

test('lookup downloads lock hints, headings and other fields, and unlock only Title', async () => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([{ id: 7, title: 'Safety', description: 'Keep this value' }]),
    'Lookups',
  )
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([{ title: 'Weekly meeting', periodic_type: 2, number_of_days: 6 }]),
    'Meetings',
  )
  const buffer = await createLookupExcelBuffer(workbook)
  const result = XLSX.read(buffer, { type: 'array' })
  assert.equal(result.Sheets.Lookups!.A1.v, lookupExcelHintText)
  assert.deepEqual(result.Sheets.Lookups!['!merges'], [{ s: { r: 0, c: 0 }, e: { r: 1, c: 2 } }])
  assert.equal(result.Sheets.Lookups!.B3.v, 'Title')
  assert.deepEqual(readLookupRows(result.Sheets.Lookups!, { header: 1 }), [
    ['id', 'title', 'description'],
    [7, 'Safety', 'Keep this value'],
  ])
  assert.deepEqual(readLookupRows(result.Sheets.Meetings!, { header: 1 }), [
    ['title', 'periodic_type', 'number_of_days'],
    ['Weekly meeting', 2, 6],
  ])
  assert.equal(workbook.Sheets.Lookups!.A1.v, 'id', 'the source workbook is unchanged')

  const zip = await JSZip.loadAsync(buffer)
  const styles = await zip.file('xl/styles.xml')!.async('string')
  const fonts = styles
    .match(/<fonts[^>]*>([\s\S]*?)<\/fonts>/)![1]!
    .match(/<font>[\s\S]*?<\/font>/g)!
  const xfs = styles
    .match(/<cellXfs[^>]*>([\s\S]*?)<\/cellXfs>/)![1]!
    .match(/<xf\b[^>]*?\/>|<xf\b[^>]*>[\s\S]*?<\/xf>/g)!
  for (const [sheetIndex, titleLetter, titleNumber] of [
    [1, 'B', 2],
    [2, 'A', 1],
  ] as const) {
    const xml = await zip.file(`xl/worksheets/sheet${sheetIndex}.xml`)!.async('string')
    assert.match(xml, /<sheetProtection\b[^>]*sheet="1"/)
    const styleAt = (address: string) => {
      const cell = xml.match(new RegExp(`<c\\b[^>]*\\br="${address}"[^>]*>`))![0]
      return Number(cell.match(/\bs="(\d+)"/)![1])
    }
    assert.match(xfs[styleAt(`${titleLetter}4`)]!, /<protection locked="0"/)
    assert.match(xfs[styleAt(`${titleLetter}3`)]!, /<protection locked="1"/)
    assert.match(xfs[styleAt('A1')]!, /<protection locked="1"/)
    const hintFont = Number(xfs[styleAt('A1')]!.match(/fontId="(\d+)"/)![1])
    assert.match(fonts[hintFont]!, /<color rgb="FFCC0000"/)
    assert.match(fonts[hintFont]!, /<b\/>/)
    const otherCell = titleLetter === 'A' ? 'B4' : 'A4'
    assert.match(xfs[styleAt(otherCell)]!, /<protection locked="1"/)
    const column = xml.match(new RegExp(`<col\\b[^>]*\\bmin="${titleNumber}"[^>]*/>`))![0]
    assert.equal(
      Number(column.match(/\bstyle="(\d+)"/)![1]),
      styleAt(`${titleLetter}4`),
      'new blank Title cells inherit the unlocked style',
    )
  }
})

test('imports still accept old files and empty exports keep an editable Title column', async () => {
  const old = XLSX.utils.aoa_to_sheet([['title'], ['Original title']])
  assert.deepEqual(readLookupRows(old, { header: 1 }), [['title'], ['Original title']])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([]), 'Empty')
  const buffer = await createLookupExcelBuffer(workbook)
  const result = XLSX.read(buffer)
  assert.equal(result.Sheets.Empty!.A3.v, 'Title')
  assert.deepEqual(result.Sheets.Empty!['!merges'], [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }])
  assert.deepEqual(readLookupRows(result.Sheets.Empty!, { header: 1 }), [['title']])
  const previousTemplate = XLSX.utils.aoa_to_sheet([
    [lookupExcelHints[0]],
    [lookupExcelHints[1]],
    ['title'],
    ['Previous title'],
  ])
  assert.deepEqual(readLookupRows(previousTemplate, { header: 1 }), [['title'], ['Previous title']])
})
