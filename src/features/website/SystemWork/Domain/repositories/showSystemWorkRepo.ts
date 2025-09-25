import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemWorkDetailsModel from '../../Data/models/SystemWorkDetailsModel'
import { ShowSystemWorkApiService } from '../../Data/apiServices/showSystemWorkApiService'


// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowSystemWorkRepo extends RepoInterface<SystemWorkDetailsModel> {
  private static instance: ShowSystemWorkRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemWorkRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemWorkDetailsModel {
    return SystemWorkDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSystemWorkApiService.getInstance()
  }
}

export { ShowSystemWorkRepo }
