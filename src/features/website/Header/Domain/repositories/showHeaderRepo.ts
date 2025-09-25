import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HeaderDetailsModel from '../../Data/models/HeaderDetailsModel'
import { ShowHeaderApiService } from '../../Data/apiServices/showHeaderApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowHeaderRepo extends RepoInterface<HeaderDetailsModel> {
  private static instance: ShowHeaderRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHeaderRepo()
    }
    return this.instance
  }

  onParse(data: any): HeaderDetailsModel {
    return HeaderDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHeaderApiService.getInstance()
  }
}

export { ShowHeaderRepo }
