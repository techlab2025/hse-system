import { test } from 'node:test'
import assert from 'node:assert/strict'
import { defaultAppearance, normalizeAppearance } from '../appearance.ts'
import {
  buildSidebarGroups,
  moveSidebarNode,
  sidebarContainerNodes,
  sidebarNodes,
} from '../sidebarLayout.ts'
const translate = (key) => key
const allRoutes = (groups) =>
  groups.flatMap((group) => group.routes.flatMap((route) => [route, ...(route.children ?? [])]))

test('Overview is always first and cannot accept or lose items', () => {
  const layout = normalizeAppearance({
    sidebarOrder: ['reports', 'operations', 'overview'],
    sidebarItemParents: { 'overview/overview': 'reports', 'operations/Projects': 'overview' },
  })
  assert.equal(layout.sidebarOrder[0], 'overview')
  assert.deepEqual(layout.sidebarItemParents, {})
  moveSidebarNode(layout, 'overview/overview', 'operations')
  moveSidebarNode(layout, 'operations/Projects', 'overview')
  assert.deepEqual(layout.sidebarItemParents, {})
  layout.sidebarOrder.reverse()
  assert.equal(buildSidebarGroups(layout, translate)[0].key, 'overview')
})

test('moving between tabs keeps each route once and preserves links and permissions', () => {
  const layout = defaultAppearance()
  moveSidebarNode(layout, 'operations/Projects', 'reports')
  layout.sidebarLabels['group:reports'] = 'Reporting & Projects'
  layout.sidebarLabels['operations/Projects'] = 'Our sites'
  layout.sidebarItemOrder.reports.unshift(layout.sidebarItemOrder.reports.pop())
  const groups = buildSidebarGroups(
    normalizeAppearance(JSON.parse(JSON.stringify(layout))),
    translate,
  )
  assert.equal(groups.find((g) => g.key === 'reports').label, 'Reporting & Projects')
  const projects = groups.find((g) => g.key === 'reports').routes[0]
  assert.equal(projects.identityKey, 'operations/Projects')
  assert.equal(projects.label, 'Our sites')
  assert.equal(projects.link, '/organization/projects')
  assert.deepEqual(
    projects.permissions,
    sidebarNodes.find((n) => n.id === projects.identityKey).route.permissions,
  )
  const routes = allRoutes(groups)
  assert.equal(routes.length, sidebarNodes.length)
  assert.equal(new Set(routes.map((route) => route.identityKey)).size, sidebarNodes.length)
  assert.equal(
    groups
      .find((g) => g.key === 'operations')
      .routes.some((r) => r.identityKey === projects.identityKey),
    false,
  )
})

test('menus retain their submenus when moved and submenu items can move independently', () => {
  const layout = defaultAppearance()
  moveSidebarNode(layout, 'operations/equipment', 'company')
  let groups = buildSidebarGroups(layout, translate)
  assert.equal(groups.find((g) => g.key === 'company').routes.at(-1).children.length, 3)
  moveSidebarNode(layout, 'operations/equipment/Tools', 'lockups')
  moveSidebarNode(layout, 'operations/Projects', 'operations/equipment')
  layout.sidebarItemOrder['operations/equipment'] = ['operations/Projects', 'Machines', 'Devices']
  groups = buildSidebarGroups(layout, translate)
  const equipment = groups.find((g) => g.key === 'company').routes.at(-1)
  assert.deepEqual(
    equipment.children.map((r) => r.name),
    ['Projects', 'Machines', 'Devices'],
  )
  assert.equal(groups.find((g) => g.key === 'lockups').routes.at(-1).name, 'Tools')
  assert.deepEqual(normalizeAppearance(JSON.parse(JSON.stringify(layout))), layout)
  moveSidebarNode(layout, 'operations/equipment/Tools', 'operations/equipment')
  assert.equal(layout.sidebarItemParents['operations/equipment/Tools'], undefined)
  assert.equal(sidebarContainerNodes(layout, 'operations/equipment').at(-1).route.name, 'Tools')
})

test('invalid placements, cyclic menu moves, unknown names and duplicate orders are ignored', () => {
  const layout = normalizeAppearance({
    sidebarItemParents: {
      'operations/equipment': 'operations/equipment',
      'operations/Projects': 'unknown',
      missing: 'reports',
    },
    sidebarLabels: {
      'group:reports': '   Reports renamed   ',
      missing: 'bad',
      'operations/Projects': '  ',
    },
    sidebarItemOrder: { operations: ['Projects', 'Projects', 'missing'] },
  })
  assert.deepEqual(layout.sidebarItemParents, {})
  assert.deepEqual(layout.sidebarLabels, { 'group:reports': 'Reports renamed' })
  assert.equal(layout.sidebarItemOrder.operations.filter((key) => key === 'Projects').length, 1)
})

test('renames and placements do not mutate saved identities and source navigation', () => {
  const saved = defaultAppearance()
  const draft = normalizeAppearance(saved)
  draft.sidebarLabels['operations/Projects'] = 'Draft projects'
  moveSidebarNode(draft, 'operations/Projects', 'reports')
  assert.deepEqual(saved.sidebarLabels, {})
  assert.deepEqual(saved.sidebarItemParents, {})
  assert.equal(sidebarNodes.find((n) => n.id === 'operations/Projects').route.name, 'Projects')
})

test('promoted submenu items keep the permissions of their original parent', () => {
  const layout = defaultAppearance()
  const source = sidebarNodes.find((node) => node.id === 'operations/equipment/Tools')
  moveSidebarNode(layout, source.id, 'reports')
  const promoted = buildSidebarGroups(layout, translate)
    .find((g) => g.key === 'reports')
    .routes.at(-1)
  assert.deepEqual(promoted.permissionGroups, [
    sidebarNodes.find((n) => n.id === 'operations/equipment').route.permissions,
  ])
  assert.deepEqual(promoted.permissions, source.route.permissions)
})

test('drag insertion sets an exact position across tabs and within the same list', () => {
  const layout = defaultAppearance()
  moveSidebarNode(layout, 'operations/Projects', 'reports', 'reports/incident_report', 'before')
  assert.deepEqual(
    sidebarContainerNodes(layout, 'reports')
      .slice(0, 3)
      .map((node) => node.id),
    ['reports/investigation_report', 'operations/Projects', 'reports/incident_report'],
  )
  moveSidebarNode(layout, 'operations/Projects', 'reports', 'reports/incident_report', 'after')
  assert.deepEqual(
    sidebarContainerNodes(layout, 'reports')
      .slice(0, 3)
      .map((node) => node.id),
    ['reports/investigation_report', 'reports/incident_report', 'operations/Projects'],
  )
  moveSidebarNode(
    layout,
    'operations/Projects',
    'operations/equipment',
    'operations/equipment/Tools',
    'before',
  )
  assert.equal(sidebarContainerNodes(layout, 'operations/equipment')[0].id, 'operations/Projects')
  const snapshot = JSON.stringify(layout)
  moveSidebarNode(layout, 'operations/Projects', 'operations/equipment', 'operations/Projects')
  moveSidebarNode(layout, 'operations/Projects', 'reports', 'not-a-member')
  assert.equal(JSON.stringify(layout), snapshot)
  assert.deepEqual(normalizeAppearance(JSON.parse(JSON.stringify(layout))), layout)
})

test('custom groups accept items and menus, preserve their order and survive serialization', async () => {
  const { addSidebarGroup } = await import('../sidebarLayout.ts')
  const layout = defaultAppearance()
  const key = addSidebarGroup(layout, 'Safety management', 'safety')
  assert.equal(key, 'custom:safety')
  moveSidebarNode(layout, 'operations/Projects', key)
  moveSidebarNode(layout, 'operations/equipment', key)
  moveSidebarNode(layout, 'reports/incident_report', 'operations/equipment')
  layout.sidebarLabels[`group:${key}`] = 'Safety team'
  layout.sidebarItemOrder[key].reverse()
  layout.sidebarOrder = [
    'overview',
    key,
    ...layout.sidebarOrder.filter((item) => item !== 'overview' && item !== key),
  ]
  const saved = normalizeAppearance(JSON.parse(JSON.stringify(layout)))
  assert.deepEqual(saved, layout)
  const group = buildSidebarGroups(saved, translate)[1]
  assert.equal(group.key, key)
  assert.equal(group.label, 'Safety team')
  assert.deepEqual(
    group.routes.map((route) => route.name),
    ['equipment', 'Projects'],
  )
  assert.ok(group.routes[0].children.some((route) => route.name === 'incident_report'))
  const routes = allRoutes(buildSidebarGroups(saved, translate))
  assert.equal(routes.length, sidebarNodes.length)
  assert.equal(new Set(routes.map((route) => route.identityKey)).size, sidebarNodes.length)
})

test('removing a custom group returns items to their original parents without deleting routes', async () => {
  const { addSidebarGroup, removeSidebarGroup } = await import('../sidebarLayout.ts')
  const layout = defaultAppearance()
  const key = addSidebarGroup(layout, 'New group', 'remove')
  moveSidebarNode(layout, 'operations/equipment', key)
  moveSidebarNode(layout, 'operations/equipment/Tools', key)
  moveSidebarNode(layout, 'operations/Projects', key)
  layout.sidebarLabels[`group:${key}`] = 'Renamed'
  removeSidebarGroup(layout, key)
  assert.deepEqual(layout.sidebarCustomGroups, [])
  assert.equal(layout.sidebarOrder.includes(key), false)
  assert.equal(layout.sidebarLabels[`group:${key}`], undefined)
  assert.equal(layout.sidebarItemOrder[key], undefined)
  assert.deepEqual(layout.sidebarItemParents, {})
  assert.equal(
    sidebarContainerNodes(layout, 'operations/equipment').some(
      (node) => node.route.name === 'Tools',
    ),
    true,
  )
  assert.equal(allRoutes(buildSidebarGroups(layout, translate)).length, sidebarNodes.length)
  const before = JSON.stringify(layout)
  removeSidebarGroup(layout, 'operations')
  assert.equal(JSON.stringify(layout), before)
})

test('custom group normalization rejects unsafe/duplicate IDs and preserves older settings', () => {
  assert.deepEqual(normalizeAppearance({}).sidebarCustomGroups, [])
  const result = normalizeAppearance({
    sidebarCustomGroups: [
      null,
      { key: 'overview', label: 'Fake overview' },
      { key: 'custom:one', label: '  Valid  ' },
      { key: 'custom:one', label: 'Duplicate' },
      { key: 'custom:two', label: '' },
      { key: 'operations/equipment', label: 'Fake submenu' },
    ],
    sidebarItemParents: {
      'operations/Projects': 'custom:one',
      'operations/Inspection': 'custom:two',
    },
  })
  assert.deepEqual(result.sidebarCustomGroups, [{ key: 'custom:one', label: 'Valid' }])
  assert.deepEqual(result.sidebarItemParents, { 'operations/Projects': 'custom:one' })
  assert.equal(result.sidebarOrder[0], 'overview')
  assert.deepEqual(result.sidebarItemOrder['custom:one'], ['operations/Projects'])
})
