import { useProjectSelectStore } from '@/stores/ProjectSelect'

type ProjectInput = number | readonly number[] | null | undefined
export const validProjectId = (value: unknown): number | undefined => {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}
export function resolveProjectIds(explicit?: ProjectInput): number[] {
  const values = Array.isArray(explicit) ? explicit : [explicit]
  const ids = [
    ...new Set(values.map(validProjectId).filter((id): id is number => id !== undefined)),
  ]
  if (ids.length) return ids
  const selected = validProjectId(useProjectSelectStore().getProjectId())
  return selected ? [selected] : []
}
export const resolveProjectId = (explicit?: ProjectInput) => resolveProjectIds(explicit)[0]

export function withProjectId<T extends object>(
  data: T,
  explicit?: ProjectInput,
): T & { project_id?: number } {
  const result = { ...data } as T & { project_id?: number }
  delete result.project_id
  const id = resolveProjectId(explicit)
  if (id) result.project_id = id
  return result
}
export function withProjectIds<T extends object>(
  data: T,
  explicit?: ProjectInput,
): T & { project_ids?: number[] } {
  const result = { ...data } as T & { project_ids?: number[] }
  delete result.project_ids
  const ids = resolveProjectIds(explicit)
  if (ids.length) result.project_ids = ids
  return result
}
