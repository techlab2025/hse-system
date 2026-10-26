/** Run with Vite running: node scripts/pdf-export-regression.mjs [http://127.0.0.1:5180] */
import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir, stat, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const origin = process.argv[2] || 'http://127.0.0.1:5180'
const output = join(tmpdir(), 'hse-pdf-regression')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route(`${origin}/__pdf-regression`, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html data-theme="dark"><head><meta charset="utf-8"><style>
      @font-face { font-family: Cairo; src: url('/src/assets/fonts/Cairo/Cairo-Regular.ttf'); }
      body { margin: 24px; background: #152239; color: white; font-family: Cairo, Arial, sans-serif; }
      #report { width: 1060px; background: #152239; }
      h1 { font-size: 27px; } table { width: 1300px; border-collapse: collapse; }
      td { height: 44px; } th { text-align: left; } .table-responsive { height: 180px; overflow: auto; }
      textarea { width: 600px; height: 30px; } .report-section { padding: 16px; margin-top: 16px; }
    </style></head><body>
      <article id="report"><h1>Incident & Safety Review</h1><p>October 2026 / Operations overview</p>
      <button data-pdf-exclude>DO NOT EXPORT THIS ACTION</button>
      <div class="table-responsive"><table><thead><tr><th>Reference</th><th>Location</th><th>Finding</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${Array.from({ length: 42 }, (_, i) => `<tr><td>HSE-${String(i + 1).padStart(3, '0')}</td><td>Zone ${(i % 4) + 1}</td><td>Inspection finding ${i + 1} — corrective action reviewed</td><td>${i % 2 ? 'Closed' : 'In progress'}</td><td><button>Edit</button></td></tr>`).join('')}</tbody></table></div>
      <section class="report-section"><h2>Conclusion / نتائج المراجعة</h2><textarea>All 42 records have been reviewed.\nFollow-up actions remain assigned to the safety team.\nتمت مراجعة إجراءات السلامة والصحة المهنية.\nEND OF REPORT — CONTENT MUST NOT BE CLIPPED</textarea></section>
      </article><script type="module">
      import { exportBrandedPdf, paginateReport, removePdfActions } from '/src/shared/utils/exportBrandedPdf.ts';
      window.removePdfActions = removePdfActions; window.exportReport = exportBrandedPdf; window.paginateReport = paginateReport; window.ready = true;
      </script></body></html>`,
    }),
  )
  await page.goto(`${origin}/__pdf-regression`)
  await page.waitForFunction(() => window.ready)
  const pages = await page.evaluate(() =>
    window.paginateReport(1200, 500, [
      { start: 450, end: 550 },
      { start: 900, end: 1050 },
    ]),
  )
  assert.deepEqual(pages, [
    { start: 0, end: 450 },
    { start: 450, end: 900 },
    { start: 900, end: 1200 },
  ])
  assert.deepEqual(
    await page.evaluate(() => window.paginateReport(1200, 500, [{ start: 0, end: 1100 }])),
    [
      { start: 0, end: 500 },
      { start: 500, end: 1000 },
      { start: 1000, end: 1200 },
    ],
  )
  assert.deepEqual(await page.evaluate(() => window.paginateReport(1001, 500)), [
    { start: 0, end: 500 },
    { start: 500, end: 1001 },
  ])
  assert.deepEqual(
    await page.evaluate(() =>
      window.paginateReport(700, 500, [
        { start: 300, end: 460 },
        { start: 450, end: 550 },
      ]),
    ),
    [
      { start: 0, end: 300 },
      { start: 300, end: 700 },
    ],
  )
  assert.deepEqual(
    await page.evaluate(() =>
      window.paginateReport(900, 500, [
        { start: 0.5, end: 300.5 },
        { start: 300.5, end: 600.5 },
        { start: 600.5, end: 900 },
      ]),
    ),
    [
      { start: 0, end: 300 },
      { start: 300, end: 600 },
      { start: 600, end: 900 },
    ],
  )
  const cleaned = await page.evaluate(() => {
    const target = document.createElement('div')
    target.innerHTML = `
      <button>Save</button><a role="button">Publish</a><input type="submit">
      <a href="/reference">Reference link</a>
      <table id="labeled"><colgroup><col><col><col></colgroup>
        <thead><tr><th>Name</th><th>Corrective action</th><th></th></tr></thead>
        <tbody><tr><td>Site A</td><td>Repair equipment</td><td data-label="Actions"><button>Edit</button></td></tr></tbody>
        <tfoot><tr><td colspan="3">Summary</td></tr></tfoot></table>
      <table id="dropdown"><thead><tr><th>Name</th><th></th></tr></thead>
        <tbody><tr><td>Site B</td><td><div class="list-trigger">Menu</div></td></tr></tbody></table>
      <table id="arabic"><thead><tr><th>Name</th><th>الإجراءات</th></tr></thead>
        <tbody><tr><td>Site C</td><td>Edit</td></tr></tbody></table>
      <table id="grouped"><thead><tr><th rowspan="2">Name</th><th colspan="2">Details</th></tr>
        <tr><th>Status</th><th>Actions</th></tr></thead>
        <tbody><tr><td>Site D</td><td>Open</td><td>Edit</td></tr></tbody></table>
      <table id="report-columns"><colgroup><col><col><col><col></colgroup><thead><tr>
        <th>Task</th><th><button class="header-hint-trigger">Responsible person<span class="header-hint-icon">?</span></button></th>
        <th data-pdf-exclude>Related records</th><th data-pdf-exclude>إجراءات التقرير</th>
        </tr></thead><tbody><tr><td>Repair equipment</td><td>Safety manager</td>
        <td><a href="/investigation/1">Investigation 1</a></td><td>View results</td></tr>
        <tr><td colspan="4">Report summary</td></tr></tbody></table>`
    window.removePdfActions(target)
    return {
      controls: target.querySelectorAll('button, [role="button"], input, .list-trigger').length,
      reference: target.querySelector('a')?.textContent,
      headings: [...target.querySelectorAll('#labeled th')].map((node) => node.textContent),
      columns: target.querySelectorAll('#labeled col').length,
      summarySpan: target.querySelector('#labeled tfoot td').colSpan,
      dropdownCells: target.querySelectorAll('#dropdown td').length,
      arabicCells: target.querySelectorAll('#arabic td').length,
      groupedCells: target.querySelectorAll('#grouped tbody td').length,
      groupedSpan: target.querySelector('#grouped thead tr th:nth-child(2)').colSpan,
      reportHeadings: [...target.querySelectorAll('#report-columns th')].map(
        (node) => node.textContent,
      ),
      reportCells: target.querySelector('#report-columns tbody tr').cells.length,
      reportColumns: target.querySelectorAll('#report-columns col').length,
      reportSummarySpan: target.querySelector('#report-columns tbody tr:last-child td').colSpan,
      content: target.textContent,
    }
  })
  assert.equal(cleaned.controls, 0)
  assert.equal(cleaned.reference, 'Reference link')
  assert.deepEqual(cleaned.headings, ['Name', 'Corrective action'])
  assert.equal(cleaned.columns, 2)
  assert.equal(cleaned.summarySpan, 2)
  assert.equal(cleaned.dropdownCells, 1)
  assert.equal(cleaned.arabicCells, 1)
  assert.equal(cleaned.groupedCells, 2)
  assert.equal(cleaned.groupedSpan, 1)
  assert.deepEqual(cleaned.reportHeadings, ['Task', 'Responsible person'])
  assert.equal(cleaned.reportCells, 2)
  assert.equal(cleaned.reportColumns, 2)
  assert.equal(cleaned.reportSummarySpan, 2)
  assert.ok(!cleaned.content.includes('Investigation 1'))
  assert.ok(!cleaned.content.includes('View results'))
  assert.ok(cleaned.content.includes('Repair equipment'))
  assert.ok(!cleaned.content.includes('Edit'))
  const original = await page.locator('#report').innerHTML()
  for (const orientation of ['landscape', 'portrait']) {
    const downloadPromise = page.waitForEvent('download')
    await page.evaluate(async (orientation) => {
      const logo =
        'data:image/svg+xml;base64,' +
        btoa(
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="#0f766e"/><text x="32" y="40" font-family="Arial" font-size="23" fill="white" text-anchor="middle">AC</text></svg>',
        )
      await window.exportReport({
        target: document.querySelector('#report'),
        title: 'Incident & Safety Review',
        filename: `hse-${orientation}`,
        orientation,
        identity: {
          name: 'Atlas Construction',
          logo,
          primaryColor: '#0f766e',
          secondaryColor: '#123449',
          accentColor: '#e4b35d',
        },
        organization: 'Atlas Construction / شركة أطلس للإنشاءات',
        exportedAt: new Date('2026-10-12T10:30:00Z'),
      })
    }, orientation)
    const download = await downloadPromise
    const path = join(output, download.suggestedFilename())
    await download.saveAs(path)
    assert.ok((await stat(path)).size > 10000)
    const pdfData = (await readFile(path)).toString('latin1')
    const pageCount = (pdfData.match(/\/Type\s*\/Page\b/g) || []).length
    assert.ok(
      pageCount >= 2 && pageCount <= (orientation === 'landscape' ? 10 : 5),
      `Unexpected page count: ${pageCount}`,
    )
    assert.equal(await page.locator('#report').innerHTML(), original)
    assert.equal(await page.locator('.hse-pdf-chrome, [data-pdf-capture]').count(), 0)
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
    console.log(`Exported ${path}; live DOM and theme preserved.`)
  }
  assert.deepEqual(errors, [])
  console.log(
    'PASS: pagination, oversized blocks, portrait/landscape downloads, custom identity, cleanup and unchanged live content.',
  )
} finally {
  await browser.close()
}
