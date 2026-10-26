/** Run: npx tsx --tsconfig tsconfig.app.json scripts/capa-project-filter.test.ts */
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import IndexCapaParams from '../src/features/Organization/Capa/Core/params/indexCapaParams'
import { useProjectSelectStore } from '../src/stores/ProjectSelect'

setActivePinia(createPinia())
const projects = useProjectSelectStore()
const payload = (projectId?: number[]) =>
  new IndexCapaParams({
    word: 'safety',
    pageNumber: 1,
    perPage: 10,
    withPage: 1,
    type: [],
    projectId,
  }).toMap()

projects.setProjectId({ id: 41, title: 'Header project' })
assert.deepEqual(payload([]).project_ids, [41])
assert.deepEqual(payload().project_ids, [41])
assert.deepEqual(payload([7, 8]).project_ids, [7, 8])
assert.deepEqual(payload([0, -1, 7, NaN]).project_ids, [7])
assert.deepEqual(payload([0, -1]).project_ids, [41])
projects.setProjectId({ id: 52, title: 'Another header project' })
assert.deepEqual(payload([]).project_ids, [52])
projects.clearProject()
assert.equal('project_ids' in payload([]), false)
assert.equal('project_ids' in payload(), false)
assert.deepEqual(payload([7]).project_ids, [7])
projects.setProjectId({ id: -1, title: 'All projects' })
assert.equal('project_ids' in payload([]), false)
assert.equal(payload().word, 'safety')
assert.equal(payload().limit, 10)
console.log(
  'PASS: CAPA uses header project for empty/omitted filters, preserves explicit IDs, ignores invalid IDs, and omits project_ids for All projects.',
)
