import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class InvestigationTaskEmployeesModel {
  public employee: OrganizatoinEmployeeDetailsModel
  public followUpEmployee: OrganizatoinEmployeeDetailsModel

  constructor(
    employee: OrganizatoinEmployeeDetailsModel,
    followUpEmployee: OrganizatoinEmployeeDetailsModel,
  ) {
    this.employee = employee
    this.followUpEmployee = followUpEmployee
  }

  static fromMap(data: any): InvestigationTaskEmployeesModel {
    return new InvestigationTaskEmployeesModel(data.employee, data.follow_up_employee)
  }
}
