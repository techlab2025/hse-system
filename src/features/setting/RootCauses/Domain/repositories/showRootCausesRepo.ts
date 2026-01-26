import { ShowRootCausesApiService } from '@/features/setting/RootCauses/Data/apiServices/showRootCausesApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import RootCausesDetailsModel from '../../Data/models/RootCausesDetailsModel'

class ShowRootCausesRepo extends RepoInterface<RootCausesDetailsModel> {
  private static instance: ShowRootCausesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowRootCausesRepo()
    }
    return this.instance
  }

  onParse(data: any): RootCausesDetailsModel {
    return RootCausesDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowRootCausesApiService.getInstance()
  }
}

export { ShowRootCausesRepo }
