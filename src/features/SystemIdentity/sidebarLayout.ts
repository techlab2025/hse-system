import {
  organizationNavigation,
  orderByKeys,
  type SidebarRoute,
} from '@/shared/LayoutComponents/organizationNavigation'

export interface CustomSidebarGroup {
  key: string
  label: string
}
export interface SidebarLayoutSettings {
  sidebarCustomGroups: CustomSidebarGroup[]
  sidebarOrder: string[]
  sidebarItemOrder: Record<string, string[]>
  sidebarItemParents: Record<string, string>
  sidebarLabels: Record<string, string>
}
export interface SidebarNode {
  id: string
  parent: string
  route: SidebarRoute
  isMenu: boolean
  locked: boolean
  permissionGroups: SidebarRoute['permissions'][]
}
export interface LayoutRoute extends SidebarRoute {
  identityKey: string
  label: string
  permissionGroups: SidebarRoute['permissions'][]
  children?: LayoutRoute[]
}

// Keys use the original location, so renaming or moving an item never changes its identity.
export const sidebarNodes: SidebarNode[] = organizationNavigation.flatMap((group) =>
  group.routes.flatMap((route) => {
    const id = `${group.key}/${route.name}`
    return [
      {
        id,
        parent: group.key,
        route,
        isMenu: Boolean(route.children?.length),
        locked: group.key === 'overview',
        permissionGroups: [],
      },
      ...(route.children ?? []).map((child) => ({
        id: `${id}/${child.name}`,
        parent: id,
        route: child,
        isMenu: false,
        locked: group.key === 'overview',
        permissionGroups: [route.permissions],
      })),
    ]
  }),
)
const nodesById = new Map(sidebarNodes.map((node) => [node.id, node]))
export const sidebarContainers = [
  ...organizationNavigation.map((group) => group.key),
  ...sidebarNodes.filter((node) => node.isMenu).map((node) => node.id),
]
export function sidebarGroups(layout: SidebarLayoutSettings): {
  key: string
  label: string
  icon: string
  routes: readonly SidebarRoute[]
  custom?: boolean
}[] {
  return [
    ...organizationNavigation,
    ...layout.sidebarCustomGroups.map((group) => ({
      ...group,
      icon: 'folder',
      routes: [],
      custom: true,
    })),
  ]
}
const allContainers = (layout: SidebarLayoutSettings) => [
  ...sidebarContainers,
  ...layout.sidebarCustomGroups.map((group) => group.key),
]
export const sidebarParent = (layout: SidebarLayoutSettings, node: SidebarNode) =>
  layout.sidebarItemParents[node.id] ?? node.parent
export const sidebarOrderKey = (node: SidebarNode, parent: string) =>
  node.parent === parent ? node.route.name : node.id
export const sidebarLabel = (layout: SidebarLayoutSettings, key: string, fallback: string) =>
  layout.sidebarLabels[key] || fallback
export const canMoveSidebarNode = (
  node: SidebarNode,
  target: string,
  layout: SidebarLayoutSettings,
) =>
  !node.locked &&
  target !== 'overview' &&
  target !== node.id &&
  allContainers(layout).includes(target) &&
  (!node.isMenu || !nodesById.has(target))

export function sidebarContainerNodes(layout: SidebarLayoutSettings, parent: string) {
  return orderByKeys(
    sidebarNodes.filter((node) => sidebarParent(layout, node) === parent),
    layout.sidebarItemOrder[parent] ?? [],
    (node) => sidebarOrderKey(node, parent),
  )
}

export function defaultSidebarLayout(): SidebarLayoutSettings {
  return {
    sidebarCustomGroups: [],
    sidebarOrder: organizationNavigation.map((group) => group.key),
    sidebarItemOrder: Object.fromEntries(
      sidebarContainers.map((parent) => [
        parent,
        sidebarNodes.filter((node) => node.parent === parent).map((node) => node.route.name),
      ]),
    ),
    sidebarItemParents: {},
    sidebarLabels: {},
  }
}

export function normalizeSidebarLayout(
  value: Partial<SidebarLayoutSettings>,
): SidebarLayoutSettings {
  const result = defaultSidebarLayout()
  if (Array.isArray(value.sidebarCustomGroups)) {
    const seen = new Set<string>()
    for (const group of value.sidebarCustomGroups) {
      if (
        !group ||
        typeof group !== 'object' ||
        typeof group.key !== 'string' ||
        !/^custom:[a-zA-Z0-9-]+$/.test(group.key) ||
        typeof group.label !== 'string' ||
        !group.label.trim() ||
        seen.has(group.key)
      )
        continue
      seen.add(group.key)
      result.sidebarCustomGroups.push({ key: group.key, label: group.label.trim().slice(0, 120) })
    }
  }
  const groups = sidebarGroups(result).map((group) => group.key)
  result.sidebarOrder = [
    'overview',
    ...new Set(
      [...(Array.isArray(value.sidebarOrder) ? value.sidebarOrder : []), ...groups].filter(
        (key) => key !== 'overview' && groups.includes(key),
      ),
    ),
  ]
  for (const node of sidebarNodes) {
    const target = value.sidebarItemParents?.[node.id]
    if (
      typeof target === 'string' &&
      canMoveSidebarNode(node, target, result) &&
      target !== node.parent
    ) {
      result.sidebarItemParents[node.id] = target
    }
  }
  const labelKeys = [...groups.map((key) => `group:${key}`), ...nodesById.keys()]
  for (const key of labelKeys) {
    const label = value.sidebarLabels?.[key]
    if (typeof label === 'string' && label.trim())
      result.sidebarLabels[key] = label.trim().slice(0, 120)
  }
  for (const parent of allContainers(result)) {
    const members = sidebarContainerNodes(result, parent)
    const saved = value.sidebarItemOrder?.[parent]
    const order = Array.isArray(saved) ? saved : []
    const keys = order.flatMap((key) => {
      const migrated =
        parent === 'lockups' && (key === 'PPE Activity' || key === 'PPE Tools') ? 'PPE Matrix' : key
      const node = members.find((item) => item.id === migrated || item.route.name === migrated)
      return node ? [sidebarOrderKey(node, parent)] : []
    })
    result.sidebarItemOrder[parent] = [
      ...new Set([...keys, ...members.map((node) => sidebarOrderKey(node, parent))]),
    ]
  }
  return result
}

export function moveSidebarNode(
  layout: SidebarLayoutSettings,
  id: string,
  target: string,
  siblingId?: string,
  edge: 'before' | 'after' = 'before',
) {
  const node = nodesById.get(id)
  if (!node || !canMoveSidebarNode(node, target, layout)) return
  const source = sidebarParent(layout, node)
  if (id === siblingId || (source === target && !siblingId)) return
  const members = sidebarContainerNodes(layout, target).filter((member) => member.id !== id)
  const siblingIndex = members.findIndex((member) => member.id === siblingId)
  if (siblingId && siblingIndex < 0) return
  layout.sidebarItemOrder[source] = (layout.sidebarItemOrder[source] ?? []).filter(
    (key) => key !== sidebarOrderKey(node, source),
  )
  if (target === node.parent) delete layout.sidebarItemParents[id]
  else layout.sidebarItemParents[id] = target
  const order = members.map((member) => sidebarOrderKey(member, target))
  const index = siblingId ? siblingIndex + (edge === 'after' ? 1 : 0) : order.length
  order.splice(index, 0, sidebarOrderKey(node, target))
  layout.sidebarItemOrder[target] = order
}

export function addSidebarGroup(
  layout: SidebarLayoutSettings,
  label: string,
  id = crypto.randomUUID(),
) {
  const name = label.trim().slice(0, 120)
  const key = `custom:${id}`
  if (
    !name ||
    !/^custom:[a-zA-Z0-9-]+$/.test(key) ||
    sidebarGroups(layout).some((group) => group.key === key)
  )
    return
  layout.sidebarCustomGroups.push({ key, label: name })
  layout.sidebarOrder.push(key)
  layout.sidebarItemOrder[key] = []
  return key
}

export function removeSidebarGroup(layout: SidebarLayoutSettings, key: string) {
  if (!layout.sidebarCustomGroups.some((group) => group.key === key)) return
  for (const node of sidebarContainerNodes(layout, key))
    moveSidebarNode(layout, node.id, node.parent)
  layout.sidebarCustomGroups = layout.sidebarCustomGroups.filter((group) => group.key !== key)
  layout.sidebarOrder = layout.sidebarOrder.filter((group) => group !== key)
  delete layout.sidebarItemOrder[key]
  delete layout.sidebarLabels[`group:${key}`]
}

export function buildSidebarGroups(
  layout: SidebarLayoutSettings,
  translate: (key: string) => string,
) {
  const toRoute = (node: SidebarNode): LayoutRoute => ({
    ...node.route,
    identityKey: node.id,
    label: sidebarLabel(layout, node.id, translate(node.route.name)),
    permissionGroups: node.permissionGroups,
    children: node.isMenu ? sidebarContainerNodes(layout, node.id).map(toRoute) : undefined,
  })
  return orderByKeys(
    sidebarGroups(layout),
    ['overview', ...layout.sidebarOrder.filter((key) => key !== 'overview')],
    (group) => group.key,
  ).map((group) => ({
    ...group,
    label: sidebarLabel(
      layout,
      `group:${group.key}`,
      group.custom ? group.label : translate(group.label),
    ),
    routes: sidebarContainerNodes(layout, group.key).map(toRoute),
  }))
}
