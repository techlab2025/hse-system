// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditSubscriptionApiService } from '../../Data/apiServices/editSubscriptionApplicationApiService'
import SubscriptionModel from '../../Data/models/SubscriptionModel'

class EditSubscriptionRepo extends RepoInterface<SubscriptionModel> {
  private static instance: EditSubscriptionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditSubscriptionRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionModel {
    return SubscriptionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditSubscriptionApiService.getInstance()
  }
}

export { EditSubscriptionRepo }
