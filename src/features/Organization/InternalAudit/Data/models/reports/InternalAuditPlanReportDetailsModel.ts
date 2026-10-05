export type InternalAuditor = {
  id: number
  name: string
}

export type InternalAuditSchedule = {
  id: number
  day: string
  startTime: string
  endTime: string
  location: string
  auditFocus: string
  assignedAuditor: string
}

const defaultPurpose =
  'To evaluate the implementation of the occupational health and safety management system against ISO 45001:2018 within the agreed audit scope.'

function parseAuditors(value: unknown): InternalAuditor[] {
  if (!Array.isArray(value)) return []
  return value.map((auditor) => {
    const item = asRecord(auditor)
    const employee = asRecord(item.employee ?? item.organization_employee)
    const source = Object.keys(employee).length ? employee : item
    return {
      id: Number(source.id ?? source.organization_employee_id ?? 0),
      name: String(source.name ?? source.title ?? ''),
    }
  })
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function parseSchedule(value: unknown): InternalAuditSchedule[] {
  if (!Array.isArray(value)) return []

  return value.map((entry) => {
    const item = asRecord(entry)
    const auditFocus = asRecord(item.audit_focus)
    const assignedAuditor = asRecord(item.assigned_auditor)

    return {
      id: Number(item.id ?? 0),
      day: String(item.day ?? ''),
      startTime: String(item.start_time ?? ''),
      endTime: String(item.end_time ?? ''),
      location: String(item.location ?? ''),
      auditFocus: String(auditFocus.title ?? auditFocus.name ?? ''),
      assignedAuditor: String(assignedAuditor.name ?? assignedAuditor.title ?? ''),
    }
  })
}

export default class InternalAuditPlanReportDetailsModel {
  constructor(
    public id: number,
    public auditNumber: string,
    public auditStartDate: string,
    public auditEndDate: string,
    public internalAuditors: InternalAuditor[],
    public purpose: string,
    public auditSchedule: InternalAuditSchedule[],
  ) {}

  static fromMap(data: unknown): InternalAuditPlanReportDetailsModel {
    const item = (data ?? {}) as Record<string, unknown>
    const rawDates = item.audit_dates
    const dates =
      rawDates && typeof rawDates === 'object' && !Array.isArray(rawDates)
        ? (rawDates as Record<string, unknown>)
        : {}
    const dateList = Array.isArray(rawDates) ? rawDates : []

    return new InternalAuditPlanReportDetailsModel(
      Number(item.id ?? item.internal_audit_plan_id ?? item.internal_audit_id ?? 0),
      String(
        item.audit_number ??
          item.audit_nume ??
          item.audit_no ??
          item.serial_name ??
          item.title ??
          '',
      ),
      String(
        item.audit_start_date ??
          dates.start_date ??
          dates.start ??
          dateList[0] ??
          (typeof rawDates === 'string' ? rawDates : ''),
      ),
      String(item.audit_end_date ?? dates.end_date ?? dates.end ?? dateList[1] ?? ''),
      parseAuditors(item.internal_auditors ?? item.internal_auditor ?? item.audit_team),
      String(item.Purpose || item.purpose || defaultPurpose),
      parseSchedule(item.audit_schedule),
    )
  }

  static example: InternalAuditPlanReportDetailsModel = new InternalAuditPlanReportDetailsModel(
    12,
    'IA-2026-0012',
    '2026-10-04',
    '2026-10-04',
    [
      { id: 101, name: 'Sara Ibrahim' },
      { id: 102, name: 'Ahmed Hassan' },
    ],
    defaultPurpose,
    [
      {
        id: 5,
        day: '2026-10-05',
        startTime: '09:00',
        endTime: '10:00',
        location: 'Main office',
        auditFocus: 'Maintenance',
        assignedAuditor: 'Example Employee',
      },
    ],
  )
}
