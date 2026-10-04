import TitleInterface from '@/base/Data/Models/title_interface'

export default class InternalAuditPlanModel extends TitleInterface {
  constructor(
    public id: number,
    public title: string,
    public auditStartDate: string,
    public auditEndDate: string,
    public status: string,
    public project: TitleInterface | null,
    public fullCompany: boolean,
    public auditStandard: TitleInterface | null,
    public auditTeam: unknown[],
    public auditScope: unknown[],
    public auditSchedule: unknown[],
    public serial_name: string = '',
    public serial_number: string = '',
    public leaderId: number = 0,
    public leader: TitleInterface | null = null,
    public generalInstructions: string = '',
    public attachments: string[] = [],
  ) {
    super({ id, title })
  }

  static fromMap(data: unknown): InternalAuditPlanModel {
    const item = (data ?? {}) as Record<string, unknown>
    const project = item.project as Record<string, unknown> | null | undefined
    const auditStandard = item.audit_standard as Record<string, unknown> | null | undefined
    const rawLeader = (item.leader ?? item.lead_auditor) as
      | Record<string, unknown>
      | null
      | undefined
    const leaderEmployee = (rawLeader?.employee ??
      rawLeader?.organization_employee ??
      rawLeader) as Record<string, unknown> | null | undefined

    return new InternalAuditPlanModel(
      Number(item.id ?? 0),
      String(item.title ?? item.audit_number ?? `IA-${item.id ?? 0}`),
      String(item.audit_start_date ?? ''),
      String(item.audit_end_date ?? ''),
      String(item.status ?? 'draft'),
      project
        ? new TitleInterface({ id: Number(project.id ?? 0), title: String(project.title ?? '') })
        : null,
      Boolean(item.full_company),
      auditStandard
        ? new TitleInterface({
            id: Number(auditStandard.id ?? 0),
            title: String(auditStandard.title ?? ''),
          })
        : null,
      Array.isArray(item.audit_team) ? item.audit_team : [],
      Array.isArray(item.audit_scope) ? item.audit_scope : [],
      Array.isArray(item.audit_schedule) ? item.audit_schedule : [],
      String(item.serial_name ?? ''),
      String(item.serial_number ?? ''),
      Number(item.leader_id ?? leaderEmployee?.id ?? 0),
      leaderEmployee
        ? new TitleInterface({
            id: Number(leaderEmployee.id ?? 0),
            title: String(leaderEmployee.title ?? leaderEmployee.name ?? ''),
          })
        : null,
      String(item.general_instructions ?? ''),
      Array.isArray(item.attachments) ? item.attachments.map(String) : [],
    )
  }

  static example: InternalAuditPlanModel = new InternalAuditPlanModel(
    12,
    'IA-2026-0012',
    '2026-10-04',
    '2026-10-04',
    'planned',
    new TitleInterface({ id: 1, title: 'Central Operations Project' }),
    false,
    new TitleInterface({ id: 1, title: 'ISO 45001:2018' }),
    [
      { employee: { id: 101, name: 'Sara Ibrahim' } },
      { employee: { id: 102, name: 'Ahmed Hassan' } },
    ],
    [{ department: { id: 22, title: 'Maintenance' }, activities: [] }],
    [
      {
        start_time: '09:00',
        end_time: '12:00',
        day: '2026-10-04',
        location: 'Maintenance Workshop',
      },
    ],
    'IA-2026-0012',
    '0012',
    101,
    new TitleInterface({ id: 101, title: 'Sara Ibrahim' }),
    'Review maintenance records before the meeting.',
    ['JVBERi0xLjQ...'],
  )
}
