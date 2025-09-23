import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationDetailsModel from '../../Data/models/OrganizationDetailsModel'
import { ShowOrganizationApiService } from '../../Data/apiServices/showOrganizationApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowOrganizationRepo extends RepoInterface<OrganizationDetailsModel> {
  private static instance: ShowOrganizationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationDetailsModel {
    return OrganizationDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowOrganizationApiService.getInstance()
  }
}

export { ShowOrganizationRepo }
