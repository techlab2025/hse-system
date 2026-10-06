export default class InternalAuditPlanAuditStandardModel {
  constructor(
    public id: number,
    public title: string,
  ) {}

  static fromMap(data: unknown): InternalAuditPlanAuditStandardModel {
    const item = (data ?? {}) as Record<string, unknown>
    return new InternalAuditPlanAuditStandardModel(
      Number(item.id ?? item.internal_audit_standard_id ?? 0),
      String(item.title ?? item.name ?? ''),
    )
  }
}
