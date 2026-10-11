import { ProjectProgressEnum } from '../../Core/Enum/ProjectProgressEnum'
import type ProjectProgressItemModel from '../../Data/models/ProjectProgressItemModel'

export type HierarchyCounts = { departments: number; positions: number }
type HierarchyEntry = { id: number; parent_id?: number | null; children?: HierarchyEntry[] }

export function countHierarchyEntries(entries: HierarchyEntry[]): HierarchyCounts {
  const departments = new Set<number>()
  const positions = new Set<number>()
  const visited = new Set<number>()
  function visit(entry: HierarchyEntry, nested = false) {
    if (!entry.id || visited.has(entry.id)) return
    visited.add(entry.id)
    if (nested || Number(entry.parent_id) > 0) positions.add(entry.id)
    else departments.add(entry.id)
    for (const child of entry.children ?? []) visit(child, true)
  }
  entries.forEach((entry) => visit(entry))
  return { departments: departments.size, positions: positions.size }
}

export function splitHierarchySteps(
  items: ProjectProgressItemModel[],
  counts: HierarchyCounts,
): ProjectProgressItemModel[] {
  return items.flatMap((item) =>
    item.id === ProjectProgressEnum.Heirarchy
      ? [
          {
            ...item,
            id: ProjectProgressEnum.Department,
            title: 'Departments',
            count: counts.departments,
            progress: counts.departments > 0,
          },
          { ...item, title: 'Positions', count: counts.positions, progress: counts.positions > 0 },
        ]
      : [item],
  )
}
