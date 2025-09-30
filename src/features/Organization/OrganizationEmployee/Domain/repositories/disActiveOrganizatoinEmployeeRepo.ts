// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import { DisOrganizatoinEmployeeApiService } from '../../Data/apiServices/disOrganizatoinEmployeeApiService'

class DisActiveOrganizatoinEmployeeRepo extends RepoInterface<OrganizatoinEmployeeModel> {
  private static instance: DisActiveOrganizatoinEmployeeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveOrganizatoinEmployeeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): OrganizatoinEmployeeModel {
    return OrganizatoinEmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisOrganizatoinEmployeeApiService.getInstance()
  }
}

export { DisActiveOrganizatoinEmployeeRepo }
