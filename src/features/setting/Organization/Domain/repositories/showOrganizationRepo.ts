import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AccidentsTypeDetailsModel from '../../Data/models/OrganizationDetailsModel'
import { ShowAccidentsTypeApiService } from '../../Data/apiServices/showOrganizationApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowAccidentsTypeRepo extends RepoInterface<AccidentsTypeDetailsModel> {
  private static instance: ShowAccidentsTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAccidentsTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): AccidentsTypeDetailsModel {
    return AccidentsTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowAccidentsTypeApiService.getInstance()
  }
}

export { ShowAccidentsTypeRepo }
