/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectFlowCustomHolidayModel from './ProjectFlowCustomHolidayModel'

export default class ProjectFlowHolidaysModel {
  constructor(
    public readonly projectId: number,
    public readonly basicHolidayDays: number[],
    public readonly hasCustomHolidayDays: boolean,
    public readonly customHolidayDays: ProjectFlowCustomHolidayModel[],
  ) {}

  static fromMap(data: Record<string, any>) {
    return new ProjectFlowHolidaysModel(
      data.project_id,
      data.basic_holiday_days ?? [],
      data.has_custom_holiday_days ?? false,
      (data.custom_holiday_days ?? []).map(ProjectFlowCustomHolidayModel.fromMap),
    )
  }
}
