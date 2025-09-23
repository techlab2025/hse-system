import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryDetailsModel from '../../Data/models/FactoryDetailsModel'
import { ShowFactoryApiService } from '../../Data/apiServices/showFactoryApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowFactoryRepo extends RepoInterface<FactoryDetailsModel> {
  private static instance: ShowFactoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowFactoryRepo()
    }
    return this.instance
  }

  onParse(data: any): FactoryDetailsModel {
    return FactoryDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowFactoryApiService.getInstance()
  }
}

export { ShowFactoryRepo }
