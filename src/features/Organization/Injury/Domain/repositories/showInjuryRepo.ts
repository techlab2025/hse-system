import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InjuryDetailsModel from '../../Data/models/InjuryDetailsModel'
import { ShowInjuryApiService } from '../../Data/apiServices/showInjuryApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowInjuryRepo extends RepoInterface<InjuryDetailsModel> {
  private static instance: ShowInjuryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInjuryRepo()
    }
    return this.instance
  }

  onParse(data: any): InjuryDetailsModel {
    return InjuryDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowInjuryApiService.getInstance()
  }
}

export { ShowInjuryRepo }
