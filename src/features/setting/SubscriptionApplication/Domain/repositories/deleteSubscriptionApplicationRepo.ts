// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import { DeleteSubscriptionApiService } from '../../Data/apiServices/deleteSubscriptionApiService'
import SubscriptionModel from '../../Data/models/SubscriptionModel'

class DeleteSubscriptionRepo extends RepoInterface<SubscriptionModel> {
  private static instance: DeleteSubscriptionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSubscriptionRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionModel {
    return SubscriptionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteSubscriptionApiService.getInstance()
  }
}

export { DeleteSubscriptionRepo }
