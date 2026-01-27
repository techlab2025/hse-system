// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import { DeleteSubscriptionTypeApiService } from '../../Data/apiServices/deleteSubscriptionTypeApiService'
import SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

class DeleteSubscriptionTypeRepo extends RepoInterface<SubscriptionTypeModel> {
  private static instance: DeleteSubscriptionTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSubscriptionTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionTypeModel {
    return SubscriptionTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteSubscriptionTypeApiService.getInstance()
  }
}

export { DeleteSubscriptionTypeRepo }
