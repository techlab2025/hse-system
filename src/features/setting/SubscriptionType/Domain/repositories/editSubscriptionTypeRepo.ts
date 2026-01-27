// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditSubscriptionTypeApiService } from '../../Data/apiServices/editSubscriptionTypeApiService'
import SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

class EditSubscriptionTypeRepo extends RepoInterface<SubscriptionTypeModel> {
  private static instance: EditSubscriptionTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditSubscriptionTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): SubscriptionTypeModel {
    return SubscriptionTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditSubscriptionTypeApiService.getInstance()
  }
}

export { EditSubscriptionTypeRepo }
