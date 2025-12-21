import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ScopeDetailsModel from '../../Data/models/ScopeDetailsModel'
import { ShowScopeApiService } from '../../Data/apiServices/showScopeApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowScopeRepo extends RepoInterface<ScopeDetailsModel> {
  private static instance: ShowScopeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowScopeRepo()
    }
    return this.instance
  }

  onParse(data: any): ScopeDetailsModel {
    return ScopeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowScopeApiService.getInstance()
  }
}

export { ShowScopeRepo }
