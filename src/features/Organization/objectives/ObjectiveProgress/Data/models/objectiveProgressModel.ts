/** Normalized application model. Wire fields must be mapped by the confirmed API adapter. */
export interface ProgressAttachment {
  id: string
  name: string
  url: string
  mimeType?: string
}
export interface ProgressCreator {
  id: number
  name: string
}
export interface ProgressCorrection {
  recordedBy: string | null
  recordedAt: string | null
  notes: string | null
}
export default class ObjectiveProgressModel {
  constructor(
    public id: number,
    public objectiveId: number,
    public period: string,
    public actualResult: number | null,
    public notes: string | null,
    public attachments: ProgressAttachment[],
    public createdBy: ProgressCreator | null,
    public recordedBy: string | null,
    public recordedAt: string | null,
    public createdAt: string | null,
    public updatedAt: string | null,
    public corrections: ProgressCorrection[],
    public indicator: number | null,
    public progress: number | null,
  ) {}

  static fromMap(data: unknown): ObjectiveProgressModel {
    const item = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
    const nullableNumber = (value: unknown): number | null =>
      value === null || value === undefined || value === '' || !Number.isFinite(Number(value))
        ? null
        : Number(value)
    const nullableString = (value: unknown): string | null =>
      value === null || value === undefined || value === '' ? null : String(value)
    const creator = (value: unknown): ProgressCreator | null => {
      if (!value || typeof value !== 'object') return null
      const user = value as Record<string, unknown>
      const id = Number(user.id)
      const name = nullableString(user.name)
      return Number.isFinite(id) && name ? { id, name } : null
    }
    const createdBy = creator(item.created_by)
    const recordedByValue = creator(item.recorded_by)?.name ?? nullableString(item.recorded_by)
    const rawAttachments = Array.isArray(item.attachments)
      ? item.attachments
      : Array.isArray(item.files)
        ? item.files
        : []
    const attachments = rawAttachments.map((value, index): ProgressAttachment => {
      const file = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
      const url = String(file.url ?? file.path ?? file.file ?? '')
      return {
        id: String(file.id ?? index),
        name: String(file.name ?? file.file_name ?? url.split('/').pop() ?? 'file'),
        url,
        mimeType: nullableString(file.mime_type ?? file.type) ?? undefined,
      }
    })
    const corrections = (Array.isArray(item.corrections) ? item.corrections : []).map(
      (value): ProgressCorrection => {
        const correction = (value && typeof value === 'object' ? value : {}) as Record<
          string,
          unknown
        >
        return {
          recordedBy: nullableString(correction.recorded_by ?? correction.user_name),
          recordedAt: nullableString(correction.recorded_at ?? correction.created_at),
          notes: nullableString(correction.notes),
        }
      },
    )

    return new ObjectiveProgressModel(
      Number(item.id ?? item.objective_progress_id ?? 0),
      Number(item.objective_id ?? 0),
      String(item.period ?? item.reporting_period ?? ''),
      nullableNumber(item.actual_result ?? item.actual),
      nullableString(item.notes),
      attachments,
      createdBy,
      recordedByValue ?? nullableString(item.created_by_name) ?? createdBy?.name ?? null,
      nullableString(item.recorded_at ?? item.created_at),
      nullableString(item.created_at),
      nullableString(item.updated_at),
      corrections,
      nullableNumber(item.indicator ?? item.achievement_percentage),
      nullableNumber(item.progress),
    )
  }
}
export function safeAttachmentUrl(value: string): string | null {
  try {
    const url = new URL(value, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}
