import { translate } from '@/localization/i18n'

const normalize = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
const planCodes: Record<string, string> = { '1': 'draft', '2': 'planned', '3': 'reported' }

/** Stable backend values, independent of translated option titles. */
export const auditPlanStatusCode = (value: unknown): string =>
  planCodes[normalize(value)] ?? normalize(value)
export const auditPlanStatusLabel = (value: unknown): string => {
  const code = auditPlanStatusCode(value)
  const keys: Record<string, string> = {
    draft: 'Draft',
    planned: 'Planned',
    reported: 'internalAuditLabels.reported',
  }
  return keys[code] ? translate(keys[code]) : String(value ?? '').replace(/_/g, ' ')
}

export const ncrStatusLabel = (value: unknown): string => {
  const keys: Record<string, string> = {
    '1': 'Pending',
    pending: 'Pending',
    '2': 'Open',
    open: 'Open',
    '3': 'In Progress',
    in_progress: 'In Progress',
    inprogress: 'In Progress',
    '4': 'Closed',
    closed: 'Closed',
  }
  const key = keys[normalize(value)]
  return key ? translate(key) : value ? String(value).replace(/_/g, ' ') : translate('Unknown')
}

export const isMajorNcrCategory = (value: unknown) =>
  ['2', 'major', 'major_nc'].includes(normalize(value))
export const ncrCategoryLabel = (value: unknown) => {
  if (isMajorNcrCategory(value)) return translate('internalAuditLabels.major')
  if (['1', 'minor', 'minor_nc'].includes(normalize(value)))
    return translate('internalAuditLabels.minor')
  return String(value ?? '').replace(/_/g, ' ') || '—'
}
