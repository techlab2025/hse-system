import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { RejectSubscriptionApplicationApiService } from '../../Data/apiServices/RejectSubscriptionApplicationApiService'
import SubscriptionModel from '@/features/setting/Subscription/Data/models/SubscriptionModel'

class RejectSubscriptionApplicationRepo extends RepoInterface<SubscriptionModel> {
  private static instance: RejectSubscriptionApplicationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RejectSubscriptionApplicationRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionModel {
    return SubscriptionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return RejectSubscriptionApplicationApiService.getInstance()
  }
}

export { RejectSubscriptionApplicationRepo }
