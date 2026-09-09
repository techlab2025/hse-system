/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CustomHolidayDay } from '../../../Core/params/UpdatedProjectFlow/CustomHolidayDayParams'
import type { ProjectLocationHierarchyDetails } from '../../../Core/params/UpdatedProjectFlow/ProjectLocationHierarchyDetailsParams'
import type { ProjectLocationTeam } from '../../../Core/params/UpdatedProjectFlow/ProjectLocationTeamParams'
import type { ProjectZoonEquipment } from '../../../Core/params/UpdatedProjectFlow/ProjectZoonEquipmentParams'
import type { HolidayDaysEnum } from '../../../Core/Enums/UpdatedProjectFlow/HolidayDaysEnum'
import ProjectFlowHolidaysModel from './ProjectFlowHolidaysModel'

export default class ProjectFlowDetailsModel {
  constructor(
    public readonly data: any,
    public readonly holidays: ProjectFlowHolidaysModel,
    public readonly basicHolidayDays: HolidayDaysEnum[],
    public readonly hasCustomHolidayDays: boolean,
    public readonly customHolidayDays: CustomHolidayDay[],
    public readonly positions: ProjectLocationHierarchyDetails[],
    public readonly teams: ProjectLocationTeam[],
    public readonly equipments: ProjectZoonEquipment[],
  ) {}

  static fromMap(data: any): ProjectFlowDetailsModel {
    const locations = data.project_locations ?? []
    const holidays = ProjectFlowHolidaysModel.fromMap(data.holidays ?? data)
    return new ProjectFlowDetailsModel(
      data,
      holidays,
      holidays.basicHolidayDays,
      holidays.hasCustomHolidayDays,
      holidays.customHolidayDays.map((holiday) => ({
        holiday_title: holiday.holidayTitle,
        holidays_dates: holiday.holidayDates,
      })),
      data.project_location_position_employees ?? locations.filter((item: any) => item.heirarchys),
      data.project_teams ?? locations.filter((item: any) => item.project_teams),
      data.project_equipments ?? data.project_zoons ?? [],
    )
  }
}
