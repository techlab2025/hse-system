export default class InternalAuditPlanAssignedAuditorModel {
  constructor(
    public id: number,
    public title: string,
  ) {}

  static fromMap(data: unknown): InternalAuditPlanAssignedAuditorModel {
    const item = (data ?? {}) as Record<string, unknown>
    const source = (item.employee ?? item.organization_employee ?? item) as Record<string, unknown>

    return new InternalAuditPlanAssignedAuditorModel(
      Number(source.id ?? item.organization_employee_id ?? item.id ?? 0),
      String(source.title ?? source.name ?? item.title ?? ''),
    )
  }
}
