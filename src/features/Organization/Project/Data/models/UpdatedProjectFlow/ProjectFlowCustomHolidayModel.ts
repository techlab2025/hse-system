export default class ProjectFlowCustomHolidayModel {
  constructor(
    public readonly holidayTitle: string,
    public readonly holidayDates: string[],
  ) {}

  static fromMap(data: { holiday_title?: string; holidays_dates?: string[] }) {
    return new ProjectFlowCustomHolidayModel(data.holiday_title ?? '', data.holidays_dates ?? [])
  }
}
