import type Params from '@/base/core/params/params'
import type { HolidayDaysEnum } from '../../Enums/UpdatedProjectFlow/HolidayDaysEnum'

export type CustomHolidayDay = {
  holiday_title: string
  holidays_dates: string[]
}

export default class ProjectHolidaysParams implements Params {
  constructor(
    public readonly basicHolidayDays: HolidayDaysEnum[],
    public readonly hasCustomHolidayDays: boolean,
    public readonly customHolidayDays: CustomHolidayDay[],
    public readonly projectId: number,
    public readonly isUpdate: boolean = false,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      basic_holiday_days: this.basicHolidayDays,
      has_custom_holiday_days: this.hasCustomHolidayDays,
      custom_holiday_days: this.customHolidayDays,
    }
  }
}
