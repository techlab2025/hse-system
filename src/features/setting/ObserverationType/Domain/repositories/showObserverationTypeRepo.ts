import { ShowObserverationTypeApiService } from '@/features/setting/ObserverationType/Data/apiServices/showObserverationTypeApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import ObserverationTypeDetailsModel from '@/features/setting/ObserverationType/Data/models/observerationTypeDetailsModel'

class ShowObserverationTypeRepo extends RepoInterface<ObserverationTypeDetailsModel> {
  private static instance: ShowObserverationTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowObserverationTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): ObserverationTypeDetailsModel {
    return ObserverationTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowObserverationTypeApiService.getInstance()
  }
}

export { ShowObserverationTypeRepo }
