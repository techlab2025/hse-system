/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CustomHolidayDay,
  ProjectLocationHierarchy,
  ProjectLocationTeam,
  ProjectZoonEquipment,
} from '../../../Core/params/UpdatedProjectFlow/ProjectFlowParams'
import type { HolidayDaysEnum } from '../../../Core/Enums/UpdatedProjectFlow/HolidayDaysEnum'

export default class ProjectFlowDetailsModel {
  constructor(
    public readonly data: any,
    public readonly basicHolidayDays: HolidayDaysEnum[],
    public readonly hasCustomHolidayDays: boolean,
    public readonly customHolidayDays: CustomHolidayDay[],
    public readonly positions: ProjectLocationHierarchy[],
    public readonly teams: ProjectLocationTeam[],
    public readonly equipments: ProjectZoonEquipment[],
  ) {}

  static fromMap(data: any): ProjectFlowDetailsModel {
    const locations = data.project_locations ?? []
    return new ProjectFlowDetailsModel(
      data,
      data.basic_holiday_days ?? [],
      data.has_custom_holiday_days ?? false,
      data.custom_holiday_days ?? [],
      data.project_location_position_employees ?? locations.filter((item: any) => item.heirarchys),
      data.project_teams ?? locations.filter((item: any) => item.project_teams),
      data.project_equipments ?? data.project_zoons ?? [],
    )
  }
}
