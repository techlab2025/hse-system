import type Params from '@/base/core/params/params'
import type { HolidayDaysEnum } from '../../Enums/UpdatedProjectFlow/HolidayDaysEnum'
import type { CustomHolidayDay } from './CustomHolidayDayParams'

export default class ProjectHolidaysParams implements Params {
  public readonly basicHolidayDays: HolidayDaysEnum[]
  public readonly hasCustomHolidayDays: boolean
  public readonly customHolidayDays: CustomHolidayDay[]
  public readonly projectId: number
  public readonly isUpdate: boolean

  constructor(data: {
    basicHolidayDays: HolidayDaysEnum[]
    hasCustomHolidayDays: boolean
    customHolidayDays: CustomHolidayDay[]
    projectId: number
    isUpdate: boolean
  }) {
    this.basicHolidayDays = data.basicHolidayDays
    this.hasCustomHolidayDays = data.hasCustomHolidayDays
    this.customHolidayDays = data.customHolidayDays
    this.projectId = data.projectId
    this.isUpdate = data.isUpdate
  }

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      basic_holiday_days: this.basicHolidayDays,
      has_custom_holiday_days: this.hasCustomHolidayDays,
      custom_holiday_days: this.customHolidayDays,
    }
  }
}
