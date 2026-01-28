import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import { ShowSubscriptionApiService } from '../../Data/apiServices/showSubscriptionApiService'
import SubscriptionDetailsModel from '../../Data/models/SubscriptionDetailsModel'

class ShowSubscriptionRepo extends RepoInterface<SubscriptionDetailsModel> {
  private static instance: ShowSubscriptionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSubscriptionRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionDetailsModel {
    return SubscriptionDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowSubscriptionApiService.getInstance()
  }
}

export { ShowSubscriptionRepo }
