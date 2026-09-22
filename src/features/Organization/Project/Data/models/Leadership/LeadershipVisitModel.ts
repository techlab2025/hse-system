export default class LeadershipVisitModel {
  constructor(
    public id: number,
    public date: string,
    public location: string,
    public monthNumber: number,
    public organizationEmployeeName: string,
    public visitActivityName: string,
  ) {}

  static fromMap(data: Record<string, unknown>): LeadershipVisitModel {
    const employee = (data.organization_employee ?? data.orgnization_employee) as Record<string, unknown> | undefined
    const activity = data.visit_activity as Record<string, unknown> | undefined
    return new LeadershipVisitModel(
      Number(data.id ?? data.visit_id),
      String(data.date ?? ''),
      String(data.location ?? ''),
      Number(data.month_number ?? 0),
      String(employee?.name ?? data.organization_employee_name ?? ''),
      String(activity?.title ?? data.visit_activity_name ?? ''),
    )
  }
}
