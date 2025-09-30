import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'
import { ShowOrganizatoinEmployeeApiService } from '../../Data/apiServices/showOrganizatoinEmployeeApiService'

class ShowOrganizatoinEmployeeRepo extends RepoInterface<OrganizatoinEmployeeDetailsModel> {
  private static instance: ShowOrganizatoinEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizatoinEmployeeRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizatoinEmployeeDetailsModel {
    return OrganizatoinEmployeeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowOrganizatoinEmployeeApiService.getInstance()
  }
}

export { ShowOrganizatoinEmployeeRepo }
