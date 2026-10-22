import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export const lookupExcelHints = [
  'Please fill in the cells under the Title column, starting from row 4.',
  'Only Title cells are editable. Instructions, column headings and all other fields are locked.',
] as const
export const lookupExcelHintText = lookupExcelHints.join('\n')

// Keep accepting older files whose headings are on the first row.
export function readLookupRows<T = unknown[]>(
  sheet: XLSX.WorkSheet,
  options?: XLSX.Sheet2JSONOpts,
): T[] {
  const hasHints =
    sheet.A1?.v === lookupExcelHintText ||
    (sheet.A1?.v === lookupExcelHints[0] && sheet.A2?.v === lookupExcelHints[1])
  const lastColumn = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1').e.c
  let headerRow = hasHints ? 2 : 0
  // Excel files may have Title on row 1 or below the two instruction rows.
  // Match the field independently of capitalization, surrounding spaces or hint wording.
  for (let row = 0; row < 3; row++) {
    const hasTitle = Array.from({ length: lastColumn + 1 }, (_, column) =>
      String(sheet[XLSX.utils.encode_cell({ r: row, c: column })]?.v ?? '')
        .trim()
        .toLowerCase(),
    ).includes('title')
    if (hasTitle) {
      headerRow = row
      break
    }
  }
  const importSheet = { ...sheet }
  // Display Title in the download while preserving the field name used by importers.
  for (let column = 0; column <= lastColumn; column++) {
    const address = XLSX.utils.encode_cell({ r: headerRow, c: column })
    if (
      String(importSheet[address]?.v ?? '')
        .trim()
        .toLowerCase() === 'title'
    ) {
      // raw:false reads the cached display text (w) before the underlying value (v).
      importSheet[address] = { ...importSheet[address], v: 'title', w: 'title' }
    }
  }
  return XLSX.utils.sheet_to_json<T>(importSheet, {
    ...options,
    ...(headerRow > 0 ? { range: headerRow } : {}),
  })
}

export async function createLookupExcelBuffer(source: XLSX.WorkBook): Promise<ArrayBuffer> {
  const workbook = XLSX.utils.book_new()
  const titleColumns: number[] = []
  for (const name of source.SheetNames) {
    const original = source.Sheets[name]!
    const rows = XLSX.utils.sheet_to_json<unknown[]>(original, {
      header: 1,
      defval: '',
      blankrows: true,
    })
    if (!rows.some((row) => row.some((value) => String(value ?? '').trim()))) {
      rows.splice(0, rows.length, ['title'])
    }
    const titleColumn = rows[0]!.findIndex(
      (value) => String(value).trim().toLowerCase() === 'title',
    )
    if (titleColumn < 0) throw new Error('Lookup Excel files must contain a Title column.')
    titleColumns.push(titleColumn)
    rows[0]![titleColumn] = 'Title'
    const sheet = XLSX.utils.aoa_to_sheet([[lookupExcelHintText], [], ...rows])
    sheet['!cols'] = rows[0]!.map((_, index) => {
      const contentWidth = Math.max(...rows.map((row) => String(row[index] ?? '').length), 12)
      return { wch: Math.min(50, Math.max(index === titleColumn ? 36 : 22, contentWidth + 3)) }
    })
    sheet['!rows'] = [
      { hpt: 30 },
      { hpt: 30 },
      { hpt: 28 },
      ...rows.slice(1).map(() => ({ hpt: 30 })),
    ]
    const lastColumn = Math.max(rows[0]!.length - 1, 0)
    sheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: lastColumn } }]
    if (lastColumn === 0) {
      sheet['!cols'] = [{ wch: 70 }]
    }
    sheet['!protect'] = { selectLockedCells: true, selectUnlockedCells: false }
    XLSX.utils.book_append_sheet(workbook, sheet, name)
  }

  // SheetJS CE writes sheet protection but omits cell protection styles.
  // Add those styles to the generated XLSX so Excel enforces Title-only editing.
  const zip = await JSZip.loadAsync(XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }))
  const styles = await zip.file('xl/styles.xml')!.async('string')
  const styleCount = Number(styles.match(/<cellXfs count="(\d+)"/)?.[1])
  if (!styleCount) throw new Error('Unable to prepare lookup Excel protection.')
  const lockedStyle = styleCount
  const unlockedStyle = styleCount + 1
  const hintStyle = styleCount + 2
  const headerStyle = styleCount + 3
  const fontCount = Number(styles.match(/<fonts count="(\d+)"/)?.[1])
  const fillCount = Number(styles.match(/<fills count="(\d+)"/)?.[1])
  const xf = (locked: boolean, fontId = 0, fillId = 0) =>
    `<xf numFmtId="0" fontId="${fontId}" fillId="${fillId}" borderId="0" xfId="0" applyFont="1" applyFill="1" applyProtection="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/><protection locked="${locked ? 1 : 0}"/></xf>`
  zip.file(
    'xl/styles.xml',
    styles
      .replace(/<fonts count="\d+"/, `<fonts count="${fontCount + 2}"`)
      .replace(
        '</fonts>',
        `<font><b/><sz val="12"/><color rgb="FFCC0000"/><name val="Calibri"/></font><font><b/><sz val="12"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts>`,
      )
      .replace(/<fills count="\d+"/, `<fills count="${fillCount + 1}"`)
      .replace(
        '</fills>',
        '<fill><patternFill patternType="solid"><fgColor rgb="FF17365D"/><bgColor indexed="64"/></patternFill></fill></fills>',
      )
      .replace(/<cellXfs count="\d+"/, `<cellXfs count="${styleCount + 4}"`)
      .replace(
        '</cellXfs>',
        `${xf(true)}${xf(false)}${xf(true, fontCount)}${xf(true, fontCount + 1, fillCount)}</cellXfs>`,
      ),
  )

  for (const [index, titleColumn] of titleColumns.entries()) {
    const path = `xl/worksheets/sheet${index + 1}.xml`
    let xml = await zip.file(path)!.async('string')
    // A column style also unlocks future blank Title cells without creating a million rows.
    xml = xml.replace(/<col\b[^>]*\/>/g, (column) => {
      const min = Number(column.match(/\bmin="(\d+)"/)?.[1])
      if (min !== titleColumn + 1) return column
      return column.replace(/\sstyle="\d+"/, '').replace('/>', ` style="${unlockedStyle}"/>`)
    })
    xml = xml.replace(/<c\b([^>]*)>/g, (cell, attributes: string) => {
      const address = attributes.match(/\br="([A-Z]+)(\d+)"/)
      if (!address) return cell
      const row = Number(address[2])
      const column = XLSX.utils.decode_col(address[1]!)
      const style =
        row <= 2
          ? hintStyle
          : row === 3
            ? headerStyle
            : column !== titleColumn
              ? lockedStyle
              : unlockedStyle
      return `<c${attributes.replace(/\ss="\d+"/, '')} s="${style}">`
    })
    zip.file(path, xml)
  }
  return zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' })
}

export async function downloadLookupWorkbook(workbook: XLSX.WorkBook, filename: string) {
  const buffer = await createLookupExcelBuffer(workbook)
  FileSaver.saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    filename,
  )
}
