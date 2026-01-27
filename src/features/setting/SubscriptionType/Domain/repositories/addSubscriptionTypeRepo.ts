import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddSubscriptionTypeApiService } from '../../Data/apiServices/addSubscriptionTypeApiService'
import SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

class AddSubscriptionTypeRepo extends RepoInterface<SubscriptionTypeModel> {
  private static instance: AddSubscriptionTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSubscriptionTypeRepo() 
    }
    return this.instance
  }

  onParse(data: any): SubscriptionTypeModel {
    return SubscriptionTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSubscriptionTypeApiService.getInstance()
  }
}

export { AddSubscriptionTypeRepo }
