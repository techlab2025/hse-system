import type ObjectiveProgressModel from './objectiveProgressModel'
import ProgressModel from './objectiveProgressModel'
/** Adapter must return complete history; pagination requires confirmation before enabling it. */
export default class ObjectiveProgressHistoryModel {
  constructor(public records: ObjectiveProgressModel[]) {}

  static fromMap(data: unknown): ObjectiveProgressHistoryModel {
    const value = data as Record<string, unknown> | unknown[] | null
    const records = Array.isArray(value)
      ? value
      : Array.isArray(value?.records)
        ? value.records
        : Array.isArray(value?.data)
          ? value.data
          : []
    return new ObjectiveProgressHistoryModel(records.map((item) => ProgressModel.fromMap(item)))
  }
}
export function sortedHistory(records: ObjectiveProgressModel[]): ObjectiveProgressModel[] {
  return [...records].sort(
    (a, b) =>
      a.period.localeCompare(b.period) ||
      (a.recordedAt ?? a.createdAt ?? '').localeCompare(b.recordedAt ?? b.createdAt ?? '') ||
      a.id - b.id,
  )
}
export function latestProgress(records: ObjectiveProgressModel[]): ObjectiveProgressModel | null {
  return sortedHistory(records).at(-1) ?? null
}
