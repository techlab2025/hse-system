export class TodayTalkEmployeeModel {
  constructor(
    public readonly id: number,
    public readonly organizationEmployeeId: number,
    public readonly isAttend: boolean,
    public readonly title: string,
  ) {}

  static fromMap(data: Record<string, unknown>): TodayTalkEmployeeModel {
    const employee =
      data.employee && typeof data.employee === 'object'
        ? (data.employee as Record<string, unknown>)
        : data.organization_employee && typeof data.organization_employee === 'object'
          ? (data.organization_employee as Record<string, unknown>)
          : null

    return new TodayTalkEmployeeModel(
      Number(data.id ?? 0),
      Number(data.organization_employee_id ?? employee?.id ?? 0),
      Boolean(data.is_attend),
      String(
        data.title ??
          data.name ??
          data.employee_name ??
          employee?.title ??
          employee?.name ??
          '',
      ),
    )
  }

  static example = new TodayTalkEmployeeModel(1, 30, true, 'Mohab Employee')
}

export default class TodayTalkModel {
  constructor(
    public readonly id: number,
    public readonly projectId: number,
    public readonly content: string,
    public readonly time: string,
    public readonly date: string,
    public readonly employees: TodayTalkEmployeeModel[],
  ) {}

  static fromMap(data: Record<string, unknown>): TodayTalkModel {
    const employees = Array.isArray(data.employees) ? data.employees : []

    return new TodayTalkModel(
      Number(data.id ?? 0),
      Number(data.project_id ?? 0),
      String(data.content ?? ''),
      String(data.time ?? ''),
      String(data.date ?? ''),
      employees.map((employee) =>
        TodayTalkEmployeeModel.fromMap(employee as Record<string, unknown>),
      ),
    )
  }

  static example = new TodayTalkModel(
    1,
    1,
    'Today we reviewed safe lifting practices, high-risk activities, and the stop-work procedure.',
    '10:30',
    '2026-08-04',
    [
      TodayTalkEmployeeModel.example,
      new TodayTalkEmployeeModel(2, 31, true, 'Ahmed Hassan'),
      new TodayTalkEmployeeModel(3, 32, false, 'Sara Ali'),
    ],
  )
}
