/** Dashboard-only read models. Missing and invalid counts are unknown, never zero. */
export type Count = number | null
export type ResourceStatus = 'loading' | 'ready' | 'empty' | 'error' | 'forbidden'
export interface Resource<T> {
  status: ResourceStatus
  data: T | null
  retrievedAt: number | null
}
export interface LocalizedName {
  title: string
  titles: { locale: string; title: string }[]
}
export interface CountRow extends LocalizedName {
  id: string
  value: Count
}
export interface SummarySnapshot {
  incidents: Count
  highRiskObservations: Count
  openCorrectiveActions: Count
  inspections: {
    scheduledThisMonth: Count
    finishedResults: Count
    new: Count
    inProgress: Count
    completed: Count
    canceled: Count
    delayed: Count
  }
  certificates: { total: Count; active: Count; inactive: Count; expired: Count }
  rootCauses: CountRow[]
  highRiskHazards: CountRow[]
}
export interface ZoneReports extends LocalizedName {
  id: string
  hazard: Count
  observation: Count
  incident: Count
}
export interface EquipmentZone extends LocalizedName {
  id: string
  total: Count
  equipment: Count
  devices: Count
  tools: Count
}
export interface EquipmentSnapshot {
  owned: Count
  rented: Count
  zones: EquipmentZone[]
}
export interface DashboardProject extends LocalizedName {
  id: number
  serial: string
  status: Count
  setupProgress: Count
  incidents: Count
  inspections: Count
  employees: Count
  equipment: Count
}
export interface ProjectSnapshot {
  rows: DashboardProject[]
  total: Count
  page: number
  lastPage: number
}
export interface DashboardData {
  summary: SummarySnapshot
  equipment: EquipmentSnapshot
  safety: ZoneReports[]
  projects: ProjectSnapshot
}
export type ResourceKey = keyof DashboardData
export type ResourceStates = { [K in ResourceKey]: Resource<DashboardData[K]> }
export interface BarSegment {
  key: string
  label: string
  value: Count
  tone: string
}
export interface BarRow {
  id: string
  label: string
  segments: BarSegment[]
}

export const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
export const array = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])
export function count(value: unknown): Count {
  if (typeof value !== 'number' && !(typeof value === 'string' && /^\d+$/.test(value.trim())))
    return null
  const result = Number(value)
  return Number.isSafeInteger(result) && result >= 0 ? result : null
}
const string = (value: unknown) => (typeof value === 'string' ? value : '')
export function name(value: unknown, fallback: unknown = ''): LocalizedName {
  const data = record(value)
  return {
    title: string(data.title) || string(data.name) || string(fallback),
    titles: array(data.titles).flatMap((item) => {
      const entry = record(item)
      return typeof entry.locale === 'string' && typeof entry.title === 'string'
        ? [{ locale: entry.locale, title: entry.title }]
        : []
    }),
  }
}
export function displayName(value: LocalizedName, locale: string): string {
  return (
    value.titles.find((item) => item.locale === locale)?.title ||
    value.title ||
    value.titles[0]?.title ||
    ''
  )
}
const countRows = (value: unknown, idKey: string, titleKey: string): CountRow[] =>
  array(value).map((item, index) => {
    const row = record(item)
    return { ...name(row, row[titleKey]), id: String(row[idKey] ?? index), value: count(row.count) }
  })
export function parseSummary(value: unknown): SummarySnapshot {
  const data = record(value),
    inspections = record(data.inspection_status),
    certificates = record(data.employee_certificates_status)
  return {
    incidents: count(data.total_incidents),
    highRiskObservations: count(data.hazard_observations_high),
    openCorrectiveActions: count(data.open_corrective_actions),
    inspections: {
      scheduledThisMonth: count(data.total_inspection_supposed_occured_this_month),
      finishedResults: count(data.total_finished_inspections_results),
      new: count(inspections.new),
      inProgress: count(inspections.in_progress),
      completed: count(inspections.completed),
      canceled: count(inspections.canceled),
      delayed: count(inspections.delayed),
    },
    certificates: {
      total: count(certificates.total),
      active: count(certificates.active),
      inactive: count(certificates.inactive),
      expired: count(certificates.expired),
    },
    rootCauses: countRows(data.most_used_root_causes, 'root_cause_id', 'root_cause_title'),
    highRiskHazards: countRows(
      data.hazard_with_high_risk_observations,
      'hazard_id',
      'hazard_title',
    ),
  }
}
export function parseSafety(value: unknown): ZoneReports[] {
  return array(value).map((item, index) => {
    const data = record(item),
      totals = record(data.all_observations)
    return {
      ...name(data, data.zone_title),
      id: String(data.zone_id ?? index),
      hazard: count(totals.hazard),
      observation: count(totals.observation),
      incident: count(totals.accidents),
    }
  })
}
export function parseEquipment(value: unknown): EquipmentSnapshot {
  const data = record(value),
    ownership = record(data.rent_and_owned_equipments)
  return {
    owned: count(ownership.owned),
    rented: count(ownership.rent),
    zones: array(data.equipment_types_and_equipments_and_zones).map((item, index) => {
      const row = record(item),
        types = array(row.equipment_types).map(record)
      // These are the existing EquipmentTypesEnum IDs, not the legacy Home enum.
      const typeCount = (type: number) =>
        count(types.find((entry) => Number(entry.type) === type)?.count)
      return {
        ...name(row),
        id: String(row.id ?? row.zone_id ?? index),
        total: count(row.total_equipments),
        equipment: typeCount(1),
        devices: typeCount(2),
        tools: typeCount(3),
      }
    }),
  }
}
export function parseProjects(
  value: unknown,
  meta: unknown,
  page: number,
  projectId: number | null,
): ProjectSnapshot {
  const metadata = record(meta)
  const rows = array(value).flatMap((item) => {
    const data = record(item),
      id = count(data.id)
    if (!id || (projectId !== null && id !== projectId)) return []
    const progress =
      typeof data.project_progress === 'number' &&
      Number.isFinite(data.project_progress) &&
      data.project_progress >= 0 &&
      data.project_progress <= 100
        ? data.project_progress
        : null
    return [
      {
        ...name(data),
        id,
        serial: string(data.serial_name) || string(data.serial_number),
        status: count(data.status),
        setupProgress: progress,
        incidents: count(data.observation_accidents_count),
        inspections: count(data.inspections_count),
        employees: count(data.assigned_employees_count),
        equipment: count(data.equipment_count),
      },
    ]
  })
  return {
    rows,
    total: projectId ? (rows.length ? 1 : null) : count(metadata.total),
    page: count(metadata.current_page) || page,
    lastPage: projectId ? 1 : count(metadata.last_page) || page,
  }
}
export function knownSum(values: Count[]): Count {
  if (!values.length || !values.every((value): value is number => value !== null)) return null
  const total = values.reduce((sum, value) => sum + value, 0)
  return Number.isSafeInteger(total) ? total : null
}
