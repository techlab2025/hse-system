import ProjectAccidentTypeModel from './ProjectAccidentTypeModel'

export default class ProjectLossTimeModel {
  constructor(
    public readonly accidentTypeId: number,
    public readonly accidentType: ProjectAccidentTypeModel,
    public readonly dailyLossTime: number,
    public readonly monthlyLossTime: number,
    public readonly yearlyLossTime: number,
  ) {}

  static fromMap(data: Record<string, unknown>): ProjectLossTimeModel {
    return new ProjectLossTimeModel(
      Number(data.accidents_type_id ?? 0),
      ProjectAccidentTypeModel.fromMap(
        data.accidents_type as Record<string, unknown> | null | undefined,
      ),
      Number(data.today_loss_time ?? 0),
      Number(data.monthly_loss_time ?? 0),
      Number(data.yealy_loss_time ?? data.yearly_loss_time ?? 0),
    )
  }
}
