/** With Vite running: node scripts/inspection-index-regression.mjs [http://127.0.0.1:5180] */
import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
const origin = process.argv[2] || 'http://127.0.0.1:5180'
const browser = await chromium.launch({ channel: 'chromium', headless: true })
const errors = []
const lists = (page) =>
  page.evaluate(() => window.calls.filter((c) => ['all', 'mine', 'results'].includes(c.type)))
async function open(query = '') {
  const page = await browser.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${origin}/scripts/fixtures/inspection-index.html${query}`)
  await expect.poll(async () => (await lists(page)).length).toBe(1)
  return page
}
try {
  const page = await open()
  let requests = await lists(page)
  assert.deepEqual(requests[0], {
    type: 'all',
    payload: {
      paginate: 1,
      page: 1,
      limit: 10,
      zone_ids: [70],
      project_ids: [7],
    },
  })
  assert.deepEqual(await page.evaluate(() => window.calls.map((c) => c.type)), [
    'projects',
    'zones',
    'all',
  ])
  await page.evaluate(() => window.index.changeTaskTab(2))
  await expect.poll(async () => (await lists(page)).length).toBe(2)
  assert.equal((await lists(page)).at(-1).type, 'mine')
  await page.evaluate(() => window.index.changePage(3))
  assert.equal((await lists(page)).at(-1).payload.page, 3)
  await page.evaluate(() => window.index.changePageSize(25))
  assert.equal((await lists(page)).at(-1).payload.limit, 25)
  await page.evaluate(() =>
    window.index.applyFilters({ date: '2026-10-26', values: { inspectionType: 2 } }),
  )
  assert.deepEqual((await lists(page)).at(-1).payload, {
    paginate: 1,
    page: 1,
    limit: 25,
    zone_ids: [70],
    project_ids: [7],
    inspection_type: 2,
    date: '2026-10-26',
  })
  await page.evaluate(() => window.index.applyZones([71, 72]))
  assert.deepEqual((await lists(page)).at(-1).payload.zone_ids, [71, 72])
  await page.evaluate(() => window.router.push('/inspection?inspectionType=2&typeId=44'))
  await expect.poll(async () => (await lists(page)).at(-1).payload.task_id).toBe(44)
  await page.evaluate(() => window.index.changeTaskTab(3))
  await expect.poll(async () => (await lists(page)).at(-1).type).toBe('results')
  assert.deepEqual((await lists(page)).at(-1).payload.zone_ids, [71, 72])
  await page.evaluate(() => window.index.resetFilters())
  assert.equal((await lists(page)).at(-1).payload.inspection_type, undefined)
  assert.equal((await lists(page)).at(-1).payload.date, undefined)
  assert.equal(
    await page.evaluate(() => window.calls.filter((c) => c.type === 'projects').length),
    1,
  )
  assert.equal(await page.evaluate(() => window.calls.filter((c) => c.type === 'zones').length), 1)
  // Header changes reload zones and request the matching project once.
  const beforeHeader = (await lists(page)).length
  await page.evaluate(() => window.projectStore.setProjectId({ id: 8, title: 'Eight' }))
  await expect.poll(async () => (await lists(page)).length).toBe(beforeHeader + 1)
  assert.deepEqual((await lists(page)).at(-1).payload.project_ids, [8])
  assert.deepEqual((await lists(page)).at(-1).payload.zone_ids, [80])
  // Identical requests made while a request is pending share the same promise.
  const beforeDuplicate = (await lists(page)).length
  await page.evaluate(() => {
    window.deferLists = true
    window.index.changePage(4)
    window.index.changePage(4)
  })
  assert.equal((await lists(page)).length, beforeDuplicate + 1)
  await page.evaluate(async () => {
    window.deferLists = false
    window.pendingLists.splice(0).forEach((resolve) => resolve())
    await window.nextTick()
  })
  // An obsolete project's zone response cannot overwrite the latest selection.
  const beforeRace = (await lists(page)).length
  await page.evaluate(() => {
    window.deferZones = true
    window.index.selectProject(9)
    window.index.selectProject(10)
    window.pendingZones.get(10)()
  })
  await expect.poll(async () => (await lists(page)).length).toBe(beforeRace + 1)
  await page.evaluate(async () => {
    window.pendingZones.get(9)()
    await window.nextTick()
  })
  assert.equal((await lists(page)).length, beforeRace + 1)
  assert.deepEqual(await page.evaluate(() => window.index.selectedZoneIds.value), [100])
  // Unmounting during option loading prevents the subsequent list request.
  await page.evaluate(async () => {
    window.index.selectProject(11)
    window.unmount()
    window.pendingZones.get(11)()
    await window.nextTick()
  })
  assert.equal((await lists(page)).length, beforeRace + 1)

  // Switching tabs while zones load reuses that request and fetches only the new tab.
  const switching = await open()
  await switching.evaluate(async () => {
    window.deferZones = true
    window.index.selectProject(9)
    await window.index.changeTaskTab(2)
    await window.nextTick()
  })
  assert.equal(
    await switching.evaluate(
      () => window.calls.filter((c) => c.type === 'zones' && c.projectId === 9).length,
    ),
    1,
  )
  await switching.evaluate(() => window.pendingZones.get(9)())
  await expect.poll(async () => (await lists(switching)).length).toBe(2)
  assert.equal((await lists(switching)).at(-1).type, 'mine')
  assert.deepEqual((await lists(switching)).at(-1).payload.zone_ids, [90])

  const audit = await open('?audit')
  assert.deepEqual(await audit.evaluate(() => window.calls.map((c) => c.type)), ['all'])
  assert.equal((await lists(audit))[0].payload.is_audit, true)
  assert.deepEqual((await lists(audit))[0].payload.project_ids, [2])
  await audit.evaluate(() => window.index.changeAuditTab('mine'))
  assert.equal((await lists(audit)).at(-1).type, 'mine')
  assert.equal((await lists(audit)).at(-1).payload.zone_ids, undefined)
  const count = (await lists(audit)).length
  await audit.evaluate(() => window.index.changeAuditTab('mine'))
  assert.equal((await lists(audit)).length, count)
  await audit.evaluate(() => window.index.changePage(2))
  assert.equal((await lists(audit)).at(-1).payload.page, 2)
  await audit.evaluate(() => window.router.push('/audit?project_id=3'))
  await expect.poll(async () => (await lists(audit)).at(-1).payload.project_ids).toEqual([3])

  const multi = await open('?multiple')
  assert.deepEqual(await multi.evaluate(() => window.calls.map((c) => c.type)), ['projects', 'all'])
  assert.equal((await lists(multi))[0].payload.project_ids, undefined)
  await multi.evaluate(() => window.index.selectProject(8))
  assert.deepEqual((await lists(multi)).at(-1).payload.zone_ids, [80])
  const beforeDeselect = (await lists(multi)).length
  await multi.evaluate(() => window.index.selectProject(undefined))
  assert.equal((await lists(multi)).length, beforeDeselect + 1)
  assert.equal((await lists(multi)).at(-1).payload.zone_ids, undefined)
  assert.equal((await lists(multi)).at(-1).payload.project_ids, undefined)
  // Failed controller promises are handled without uncaught browser errors.
  await multi.evaluate(() => {
    window.failList = true
    return window.index.changePage(2)
  })
  assert.deepEqual(errors, [])
  console.log(
    'PASS: single initial fetch, task/audit tabs, pagination, filters, header project, task ID, pending request deduplication, stale zones, unmount and failure handling.',
  )
} finally {
  await browser.close()
}
