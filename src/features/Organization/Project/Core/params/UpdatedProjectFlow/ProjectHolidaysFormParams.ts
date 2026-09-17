import type { HolidayDaysEnum } from '../../Enums/UpdatedProjectFlow/HolidayDaysEnum'

export type ProjectHolidayForm = {
  holiday_title: string
  holidays_dates: Date[]
}

export type ProjectHolidaysForm = {
  basicDays: HolidayDaysEnum[]
  hasCustom: boolean
  custom: ProjectHolidayForm[]
}
