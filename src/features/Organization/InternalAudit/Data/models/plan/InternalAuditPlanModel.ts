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
    public auditTeam: any[],
    public auditScope: any[],
    public auditSchedule: any[],
  ) {
    super({ id, title })
  }

  static fromMap(data: any): InternalAuditPlanModel {
    return new InternalAuditPlanModel(
      Number(data.id),
      data.title ?? data.audit_number ?? `IA-${data.id}`,
      data.audit_start_date ?? '',
      data.audit_end_date ?? '',
      data.status ?? 'draft',
      data.project ? new TitleInterface({ id: data.project.id, title: data.project.title }) : null,
      Boolean(data.full_company),
      data.audit_standard
        ? new TitleInterface({ id: data.audit_standard.id, title: data.audit_standard.title })
        : null,
      data.audit_team ?? [],
      data.audit_scope ?? [],
      data.audit_schedule ?? [],
    )
  }
}
