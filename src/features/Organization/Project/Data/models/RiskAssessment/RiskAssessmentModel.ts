export default class RiskAssessmentModel {
  constructor(
    public activity: string,
    public desctiprion: string,
    public workAreaStrign: string,
    public date: string,
    public employeeApproverId: number,
    public attachents: string[],
    public id?: number,
  ) {}

  static fromMap(data: Record<string, any>): RiskAssessmentModel {
    return new RiskAssessmentModel(
      data.activity ?? '',
      data.desctiprion ?? '',
      data.work_area_strign ?? '',
      data.date ?? '',
      Number(data.employee_approver_id ?? 0),
      Array.isArray(data.attachents) ? data.attachents : [],
      data.id == null ? undefined : Number(data.id),
    )
  }
}
