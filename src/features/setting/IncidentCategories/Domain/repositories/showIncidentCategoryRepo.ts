import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncidentCategoryDetailsModel from '../../Data/models/IncidentCategoryDetailsModel'
import { ShowIncidentCategoryApiService } from '../../Data/apiServices/showIncidentCategoryApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowIncidentCategoryRepo extends RepoInterface<IncidentCategoryDetailsModel> {
  private static instance: ShowIncidentCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowIncidentCategoryRepo()
    }
    return this.instance
  }

  onParse(data: any): IncidentCategoryDetailsModel {
    return IncidentCategoryDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowIncidentCategoryApiService.getInstance()
  }
}

export { ShowIncidentCategoryRepo }
