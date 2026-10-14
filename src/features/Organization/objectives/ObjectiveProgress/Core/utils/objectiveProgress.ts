import {
  ObjectiveTargetTypeEnum as Type,
  ObjectiveDirectionEnum as Direction,
  ObjectiveFrequencyEnum as Frequency,
} from '../../../Core/enums/objectivesEnums'
export interface ObjectiveMeasurement {
  year: string | number
  targetType: Type | null
  direction: Direction | null
  target: number | null
  baseline?: number | null
  unit?: string | null
  frequency: number | null
  annualOccurrences?: number | null
}
export interface ReportingPeriod {
  value: string
  label: string
  startDate: string
  endDate: string
  available: boolean
}
export type ReductionRule = 'amount' | 'final-value' | null
export const finiteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean')
    return null
  const number =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : NaN
  return Number.isFinite(number) ? number : null
}
export const validId = (value: unknown): number | null => {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}
const dateValue = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
export function generatePeriods(
  objective: ObjectiveMeasurement,
  locale = 'en',
  now = new Date(),
  reportingFrequency?: Frequency,
): ReportingPeriod[] {
  const year = Number(objective.year)
  if (!Number.isInteger(year) || year < 1000 || year > 9999) return []
  const frequency =
    reportingFrequency ??
    (objective.targetType === Type.PeriodicFrequency ? objective.frequency : Frequency.Monthly)
  if (
    ![Frequency.Annually, Frequency.SemiAnnually, Frequency.Quarterly, Frequency.Monthly].includes(
      frequency as Frequency,
    )
  )
    return []
  const count = frequency as number
  return Array.from({ length: count }, (_, index) => {
    const month = index * (12 / count),
      start = new Date(year, month, 1),
      end = new Date(year, month + 12 / count, 0)
    const arabic = locale.startsWith('ar')
    const label =
      count === Frequency.Monthly
        ? new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
            calendar: 'gregory',
          }).format(start)
        : count === Frequency.Quarterly
          ? `${arabic ? 'الربع' : 'Q'}${index + 1} ${year}`
          : count === Frequency.SemiAnnually
            ? `${arabic ? 'النصف' : 'H'}${index + 1} ${year}`
            : `${arabic ? 'سنة' : 'Year'} ${year}`
    return {
      value:
        count === Frequency.Monthly
          ? `${year}-${String(index + 1).padStart(2, '0')}`
          : count === Frequency.Annually
            ? `${year}`
            : `${year}-${count === Frequency.Quarterly ? 'Q' : 'H'}${index + 1}`,
      label,
      startDate: dateValue(year, month + 1, 1),
      endDate: dateValue(year, end.getMonth() + 1, end.getDate()),
      available: start.getTime() <= now.getTime(),
    }
  })
}
export function achievement(
  objective: ObjectiveMeasurement,
  rawActual: unknown,
  backendIndicator?: unknown,
  numberReduction: ReductionRule = null,
): number | null {
  const reported = finiteNumber(backendIndicator)
  if (reported !== null) return reported
  const actual = finiteNumber(rawActual),
    target = finiteNumber(objective.target)
  if (actual === null || actual < 0) return null
  let result: number
  if (objective.targetType === Type.PeriodicFrequency) {
    const planned = finiteNumber(objective.annualOccurrences ?? objective.frequency)
    if (planned === null || planned <= 0 || !Number.isInteger(actual)) return null
    result = (actual / planned) * 100
  } else if (objective.direction === Direction.Reduce) {
    const baseline = finiteNumber(objective.baseline)
    if (baseline === null || baseline < 0 || target === null || target <= 0) return null
    if (objective.targetType === Type.Percentage) {
      if (baseline === 0) return null
      result = ((((baseline - actual) / baseline) * 100) / target) * 100
    } else if (objective.targetType === Type.Number && numberReduction) {
      const reduction = numberReduction === 'amount' ? target : baseline - target
      if (reduction <= 0) return null
      result = ((baseline - actual) / reduction) * 100
    } else return null
  } else if (
    objective.direction === Direction.Increase &&
    (objective.targetType === Type.Number || objective.targetType === Type.Percentage)
  ) {
    if (target === null || target <= 0) return null
    result = (actual / target) * 100
  } else return null
  return Number.isFinite(result) ? result : null
}
export function actualUnit(objective: ObjectiveMeasurement): string {
  return objective.targetType === Type.Percentage && objective.direction !== Direction.Reduce
    ? '%'
    : objective.unit || ''
}
export function targetValue(objective: ObjectiveMeasurement): string {
  if (objective.targetType === Type.PeriodicFrequency)
    return String(objective.annualOccurrences ?? objective.frequency ?? '—')
  return objective.target == null
    ? '—'
    : `${objective.target}${objective.targetType === Type.Percentage ? '%' : objective.unit ? ` ${objective.unit}` : ''}`
}
export interface ProgressDraft {
  period: string
  actualResult: number | null
  notes: string
  files: File[]
  attachments: string[]
  retainedAttachmentIds: string[]
}
export interface ProgressValidationPolicy {
  duplicates: 'single' | 'multiple' | null
  existingPeriods: string[]
  editingPeriod?: string
  reportingFrequency?: Frequency
  maxFiles?: number
  maxBytes?: number
  acceptedTypes?: string[]
}
export function validateProgress(
  objectiveId: number,
  objective: ObjectiveMeasurement,
  draft: ProgressDraft,
  policy: ProgressValidationPolicy,
  now = new Date(),
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!validId(objectiveId)) errors.objective = 'op.invalidObjective'
  const period = generatePeriods(objective, 'en', now, policy.reportingFrequency).find(
    (item) => item.value === draft.period,
  )
  if (!period) errors.period = 'op.invalidPeriod'
  else if (!period.available) errors.period = 'op.futurePeriod'
  else if (
    policy.duplicates === 'single' &&
    policy.existingPeriods.includes(draft.period) &&
    draft.period !== policy.editingPeriod
  )
    errors.period = 'op.duplicatePeriod'
  const actual = finiteNumber(draft.actualResult)
  if (actual === null || actual < 0) errors.actualResult = 'op.invalidActual'
  else if (objective.targetType === Type.PeriodicFrequency && !Number.isInteger(actual))
    errors.actualResult = 'op.integerRequired'
  if (
    policy.maxFiles != null &&
    draft.files.length + draft.retainedAttachmentIds.length > policy.maxFiles
  )
    errors.files = 'op.tooManyFiles'
  if (
    draft.files.some(
      (file) =>
        (policy.maxBytes != null && file.size > policy.maxBytes) ||
        (policy.acceptedTypes?.length &&
          !policy.acceptedTypes.some((type) =>
            type.endsWith('/*')
              ? file.type.startsWith(type.slice(0, -1))
              : type.startsWith('.')
                ? file.name.toLowerCase().endsWith(type.toLowerCase())
                : file.type === type,
          )),
    )
  )
    errors.files = 'op.invalidFile'
  return errors
}
