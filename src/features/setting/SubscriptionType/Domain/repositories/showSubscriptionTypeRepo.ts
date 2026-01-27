import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import { ShowSubscriptionTypeApiService } from '../../Data/apiServices/showSubscriptionTypeApiService'
import SubscriptionTypeDetailsModel from '../../Data/models/SubscriptionTypeDetailsModel'

class ShowSubscriptionTypeRepo extends RepoInterface<SubscriptionTypeDetailsModel> {
  private static instance: ShowSubscriptionTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSubscriptionTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionTypeDetailsModel {
    return SubscriptionTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSubscriptionTypeApiService.getInstance()
  }
}

export { ShowSubscriptionTypeRepo }
