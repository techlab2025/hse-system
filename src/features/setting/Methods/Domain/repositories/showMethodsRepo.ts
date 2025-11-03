import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MethodsDetailsModel from '../../Data/models/MethodsDetailsModel'
import { ShowMethodsApiService } from '../../Data/apiServices/showMethodsApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowMethodsRepo extends RepoInterface<MethodsDetailsModel> {
  private static instance: ShowMethodsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowMethodsRepo()
    }
    return this.instance
  }

  onParse(data: any): MethodsDetailsModel {
    return MethodsDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowMethodsApiService.getInstance()
  }
}

export { ShowMethodsRepo }
