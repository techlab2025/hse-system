import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type Params from '@/base/core/params/params'
import OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'
import { ShowOrganizatoinEmployeeApiService } from '../../Data/apiServices/showOrganizatoinEmployeeApiService'

class ShowOrganizatoinEmployeeRepo extends RepoInterface<OrganizatoinEmployeeDetailsModel> {
  private static instance: ShowOrganizatoinEmployeeRepo
  private requestedEmployeeId = 0

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizatoinEmployeeRepo()
    }
    return this.instance
  }

  override async call(params: Params) {
    this.requestedEmployeeId = Number(params.toMap().organization_employee_id ?? 0)
    return super.call(params)
  }

  onParse(
    data: Record<string, unknown> | Array<Record<string, unknown>>,
  ): OrganizatoinEmployeeDetailsModel {
    const nestedData = Array.isArray(data) ? null : data.data
    const employees = Array.isArray(data)
      ? data
      : Array.isArray(nestedData)
        ? (nestedData as Array<Record<string, unknown>>)
        : null
    const employee = employees
      ? (employees.find(
          (item: Record<string, unknown>) =>
            Number(item.organization_employee_id ?? item.id) === this.requestedEmployeeId,
        ) ?? employees[0])
      : data
    return OrganizatoinEmployeeDetailsModel.fromMap(employee ?? {})
  }

  get serviceInstance(): ServicesInterface {
    return ShowOrganizatoinEmployeeApiService.getInstance()
  }
}

export { ShowOrganizatoinEmployeeRepo }
