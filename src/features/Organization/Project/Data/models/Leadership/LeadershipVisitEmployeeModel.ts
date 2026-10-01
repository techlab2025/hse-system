import LeadershipVisitCreatableModel from './LeadershipVisitCreatableModel'

export default class LeadershipVisitEmployeeModel {

  constructor(
    public id: number,
    public employeeId: number,
    public employeeName: string | null,
    public creatable: LeadershipVisitCreatableModel | null = null,
  ) {}

  static fromMap(data: Record<string,any>): LeadershipVisitEmployeeModel {

    return new LeadershipVisitEmployeeModel(
      Number(data.id ?? 0),
      Number(data.employee_id ?? 0),
      data.employee_name ? String(data.employee_name) : null,
      data.creatable
        ? LeadershipVisitCreatableModel.fromMap(data.creatable)
        : null,
    )

  }

}
