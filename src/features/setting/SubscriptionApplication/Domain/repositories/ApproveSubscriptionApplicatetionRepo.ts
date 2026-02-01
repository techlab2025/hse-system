import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ApproveSubscriptionApplicationApiService } from '../../Data/apiServices/ApproveSubscriptionApplicationApiService'
import SubscriptionModel from '@/features/setting/Subscription/Data/models/SubscriptionModel'

class ApproveSubscriptionApplicationRepo extends RepoInterface<SubscriptionModel> {
  private static instance: ApproveSubscriptionApplicationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ApproveSubscriptionApplicationRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionModel {
    return SubscriptionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ApproveSubscriptionApplicationApiService.getInstance()
  }
}

export { ApproveSubscriptionApplicationRepo }
