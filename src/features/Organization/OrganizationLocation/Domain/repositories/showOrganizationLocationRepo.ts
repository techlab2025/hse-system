import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationLocationDetailsModel from '../../Data/models/OrganizationLocationDetailsModel'
import { ShowOrganizationLocationApiService } from '../../Data/apiServices/showOrganizationLocationApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowOrganizationLocationRepo extends RepoInterface<OrganizationLocationDetailsModel> {
  private static instance: ShowOrganizationLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationLocationRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationLocationDetailsModel {
    return OrganizationLocationDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowOrganizationLocationApiService.getInstance()
  }
}

export { ShowOrganizationLocationRepo }
