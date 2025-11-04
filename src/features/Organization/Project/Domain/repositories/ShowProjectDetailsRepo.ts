import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowProjectDetailsApiService } from '../../Data/apiServices/ShowProjectDetailsApiService'
import ShowProjectDetailsModel from '../../Data/models/ShowProjectDeatilsModel'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowProjectDetailsRepo extends RepoInterface<ShowProjectDetailsModel> {
  private static instance: ShowProjectDetailsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectDetailsRepo()
    }
    return this.instance
  }

  onParse(data: any): ShowProjectDetailsModel {
    return ShowProjectDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowProjectDetailsApiService.getInstance()
  }
}

export { ShowProjectDetailsRepo }
