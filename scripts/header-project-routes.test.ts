/** Run: npx tsx --tsconfig tsconfig.app.json scripts/header-project-routes.test.ts */
import assert from 'node:assert/strict'
import {
  headerProjectDestination,
  isHeaderProjectRoute,
  projectViewKey,
  routeProjectId,
} from '../src/shared/utils/headerProjectRoutes'
const route = (
  name: string,
  path: string,
  params: Record<string, string> = {},
  query: Record<string, string> = {},
) => ({ name, path, fullPath: path, params, query, hash: '' })
for (const name of [
  'Capa',
  'Observeration',
  'Observation Report',
  'Incedant',
  'Inspection',
  'Audits',
  'Inductions',
  'Today Talks',
  'Internal Audit Register',
  'Equipment Organization',
  'Corrective Report',
  'Company PPE Matrix',
]) {
  const current = route(name, '/organization/list')
  assert.ok(isHeaderProjectRoute(current), name)
  assert.notEqual(projectViewKey(current, 41), projectViewKey(current, 52), name)
  assert.notEqual(projectViewKey(current, 41), projectViewKey(current), name)
}
for (const name of [
  'Add Observeration',
  'Edit Equipment Organization',
  'Document Categories Organization',
  'System Identity',
  'Add Induction',
  'Project Permit',
]) {
  const current = route(name, '/organization/form-or-lookup')
  assert.equal(isHeaderProjectRoute(current), false, name)
  assert.equal(projectViewKey(current, 41), undefined, name)
  assert.equal(headerProjectDestination(current, 52), undefined, name)
}
const summary = route('Project Summary Data', '/organization/project-summary/41/data/drills', {
  id: '41',
  resource: 'drills',
})
assert.equal(routeProjectId(summary), 41)
assert.equal(projectViewKey(summary, 52), 'Project Summary Data:41')
assert.deepEqual(headerProjectDestination(summary, 52), {
  name: summary.name,
  params: { id: '52', resource: 'drills' },
  query: {},
  hash: '',
})
assert.deepEqual(headerProjectDestination(summary), { name: 'Projects' })
const report = route(
  'Corrective Report',
  '/organization/corrective-report',
  {},
  { project_id: '41', status: '2' },
)
assert.deepEqual(headerProjectDestination(report, 52), {
  name: report.name,
  params: {},
  query: { project_id: '52', status: '2' },
  hash: '',
})
assert.deepEqual(headerProjectDestination(report), {
  name: report.name,
  params: {},
  query: { status: '2' },
  hash: '',
})
assert.equal(isHeaderProjectRoute(route('Equipment Organization', '/admin/equipments')), false)
console.log(
  'PASS: project lists refresh, forms/lookups keep drafts, project resource URLs retain their resource, and All Projects clears pinned query filters.',
)
