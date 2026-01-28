import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddSubscriptionApiService } from '../../Data/apiServices/addSubscriptionApiService'
import SubscriptionModel from '../../Data/models/SubscriptionModel'

class AddSubscriptionRepo extends RepoInterface<SubscriptionModel> {
  private static instance: AddSubscriptionRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSubscriptionRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionModel {
    return SubscriptionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSubscriptionApiService.getInstance()
  }
}

export { AddSubscriptionRepo }
