import test from 'node:test'
import assert from 'node:assert/strict'
import {
  count,
  knownSum,
  parseSummary,
  parseEquipment,
  parseSafety,
  parseProjects,
  displayName,
} from '../../src/features/Home/data/Model/OrganizationDashboardModel'
import Params from '../../src/features/Home/core/params/OrganizationDashboardParams'
import Repo from '../../src/features/Home/domain/repositories/OrganizationDashboardRepo'
import FetchUseCase from '../../src/features/Home/domain/usecase/FetchOrganizationDashboardUseCase'
import Controller from '../../src/features/Home/presentation/Controllers/OrganizationDashboardController'
import { dashboardPermissions } from '../../src/features/Home/presentation/composables/dashboardPermissions'
import { PermissionsEnum as P } from '../../src/features/users/Admin/Core/Enum/permission_enum'

test('validates counts without turning null, blank, booleans, decimals or invalid values into zero', () => {
  for (const value of [
    null,
    undefined,
    '',
    ' ',
    false,
    true,
    -1,
    NaN,
    Infinity,
    0.4,
    '4.4',
    {},
    Number.MAX_SAFE_INTEGER + 1,
  ])
    assert.equal(count(value), null)
  assert.equal(count(0), 0)
  assert.equal(count('17'), 17)
  assert.equal(count(' 4 '), 4)
})
test('missing summary members remain unknown and real zero is preserved', () => {
  const result = parseSummary({ total_incidents: 0, inspection_status: { completed: 54 } })
  assert.equal(result.incidents, 0)
  assert.equal(result.inspections.completed, 54)
  assert.equal(result.inspections.delayed, null)
  assert.equal(result.certificates.active, null)
  assert.equal(result.highRiskObservations, null)
  assert.deepEqual(result.rootCauses, [])
  assert.ok(!('compliance' in result.inspections))
})
test('null nested payloads and absent lists do not crash parsing', () => {
  const result = parseSummary({
    inspection_status: null,
    employee_certificates_status: null,
    most_used_root_causes: null,
  })
  assert.equal(result.inspections.scheduledThisMonth, null)
  assert.deepEqual(result.highRiskHazards, [])
  assert.deepEqual(parseSafety(null), [])
  assert.deepEqual(parseEquipment(null).zones, [])
})
test('zone report values remain categorical counts rather than fake monthly trends', () => {
  const result = parseSafety([
    {
      zone_id: 9,
      zone_title: 'Open',
      all_observations: { hazard: 2, accidents: '7', observation: 0 },
    },
  ])
  assert.deepEqual(result[0], {
    id: '9',
    title: 'Open',
    titles: [],
    hazard: 2,
    observation: 0,
    incident: 7,
  })
})
test('equipment type IDs use the existing shared equipment enum and absent groups remain unknown', () => {
  const result = parseEquipment({
    rent_and_owned_equipments: { rent: 2, owned: 8 },
    equipment_types_and_equipments_and_zones: [
      {
        title: 'Work area',
        total_equipments: 4,
        equipment_types: [
          { type: 1, count: 4 },
          { type: 3, count: 0 },
        ],
      },
    ],
  })
  assert.equal(result.owned, 8)
  assert.equal(result.rented, 2)
  assert.equal(result.zones[0]?.equipment, 4)
  assert.equal(result.zones[0]?.devices, null)
  assert.equal(result.zones[0]?.tools, 0)
})
test('localized backend names use supplied translations and preserve ordinary user values', () => {
  assert.equal(displayName({ title: 'Open', titles: [] }, 'ar'), 'Open')
  assert.equal(
    displayName({ title: 'Site', titles: [{ locale: 'ar', title: 'الموقع' }] }, 'ar'),
    'الموقع',
  )
})
test('selected-project lists reject other projects even if a server ignores the filter', () => {
  const rows = [
    { id: 1, title: 'One', project_progress: 40 },
    { id: 2, title: 'Two', project_progress: 120 },
  ]
  const result = parseProjects(rows, { total: 999, current_page: 1, last_page: 99 }, 1, 2)
  assert.equal(result.rows.length, 1)
  assert.equal(result.rows[0]?.title, 'Two')
  assert.equal(result.total, 1)
  assert.equal(result.lastPage, 1)
  assert.equal(result.rows[0]?.setupProgress, null)
})
test('portfolio counts and pagination use API metadata and do not fabricate missing totals or progress', () => {
  const result = parseProjects([{ id: 1, title: 'Project' }], null, 3, null)
  assert.equal(result.total, null)
  assert.equal(result.rows[0]?.setupProgress, null)
  assert.equal(result.page, 3)
  assert.equal(result.rows[0]?.incidents, null)
})
test('scope parameters are immutable and distinguish all-project from selected-project requests', () => {
  assert.deepEqual(new Params(null).toMap(), {})
  assert.deepEqual(new Params(12).toMap(), { project_id: 12 })
  assert.deepEqual(new Params(12, 2, true).toMap(), {
    project_id: 12,
    paginate: 1,
    page: 2,
    limit: 5,
  })
  assert.deepEqual(new Params(-1).toMap(), {})
})
test('partial permissions cannot fetch bundled safety data or unrelated equipment data', () => {
  const access = dashboardPermissions({ isMaster: 0, permission: [P.ORG_INSPECTION_FETCH] })
  assert.equal(access.inspections, true)
  assert.equal(access.summary, false)
  assert.equal(access.safety, false)
  assert.equal(access.equipment, false)
  assert.equal(dashboardPermissions(null).projects, false)
  assert.ok(Object.values(dashboardPermissions({ isMaster: 1 })).every(Boolean))
})
test('part-to-whole totals require complete counts', () => {
  assert.equal(knownSum([3, null]), null)
  assert.equal(knownSum([]), null)
  assert.equal(knownSum([0, 0]), 0)
  assert.equal(knownSum([3, 7]), 10)
})
const service = (payload: unknown, statusCode = 200) => ({
  fetch: async () => ({ data: payload, statusCode }),
})
test('repository supports direct and Laravel-paginated data wrappers', async () => {
  const direct = new Repo(service({ status: true, data: { total_incidents: 7 } }))
  assert.equal((await direct.fetch('summary', new Params(null)))?.incidents, 7)
  const paginated = new Repo(
    service({
      status: true,
      data: {
        data: [{ id: 1, title: 'Project' }],
        meta: { total: 1, current_page: 1, last_page: 1 },
      },
    }),
  )
  assert.equal((await paginated.fetch('projects', new Params(null, 1, true)))?.total, 1)
})
test('repository distinguishes empty responses from service or malformed-data failures', async () => {
  assert.equal(
    await new Repo(service({ status: true, data: null })).fetch('summary', new Params(null)),
    null,
  )
  await assert.rejects(() =>
    new Repo(service({ status: false, data: {} })).fetch('summary', new Params(null)),
  )
  await assert.rejects(() =>
    new Repo(service({ status: true, data: 'not-data' })).fetch('summary', new Params(null)),
  )
  await assert.rejects(() =>
    new Repo(service({ data: [] }, 403)).fetch('projects', new Params(null)),
  )
})
test('controller deduplicates in-flight requests and caches successful per-scope results for 30 seconds', async () => {
  let calls = 0,
    now = 1000
  const repo = new Repo({
    fetch: async () => {
      calls++
      return { data: { status: true, data: { total_incidents: 4 } }, statusCode: 200 }
    },
  })
  const controller = new Controller(new FetchUseCase(repo), () => now)
  const [a, b] = await Promise.all([
    controller.fetch('summary', new Params(1)),
    controller.fetch('summary', new Params(1)),
  ])
  assert.equal(calls, 1)
  assert.equal(a.data?.incidents, b.data?.incidents)
  await controller.fetch('summary', new Params(1))
  assert.equal(calls, 1)
  await controller.fetch('summary', new Params(2))
  assert.equal(calls, 2)
  now += 30001
  await controller.fetch('summary', new Params(1))
  assert.equal(calls, 3)
  await controller.fetch('summary', new Params(1), true)
  assert.equal(calls, 4)
})
test('failed requests are not cached and retry can succeed without an apparent zero', async () => {
  let calls = 0
  const repo = new Repo({
    fetch: async () => {
      if (++calls === 1) throw new Error('offline')
      return { statusCode: 200, data: { status: true, data: { total_incidents: 0 } } }
    },
  })
  const controller = new Controller(new FetchUseCase(repo))
  const failed = await controller.fetch('summary', new Params(null))
  assert.equal(failed.status, 'error')
  assert.equal(failed.data, null)
  const retried = await controller.fetch('summary', new Params(null))
  assert.equal(retried.status, 'ready')
  assert.equal(retried.data?.incidents, 0)
})
