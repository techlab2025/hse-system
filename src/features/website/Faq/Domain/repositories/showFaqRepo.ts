import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FaqDetailsModel from '../../Data/models/FaqDetailsModel'
import { ShowFaqApiService } from '../../Data/apiServices/showFaqApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowFaqRepo extends RepoInterface<FaqDetailsModel> {
  private static instance: ShowFaqRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowFaqRepo()
    }
    return this.instance
  }

  onParse(data: any): FaqDetailsModel {
    return FaqDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowFaqApiService.getInstance()
  }
}

export { ShowFaqRepo }
