// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FaqModel from '../../Data/models/FaqModel'
import { DeleteFaqApiService } from '../../Data/apiServices/deleteFaqApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteFaqRepo extends RepoInterface<FaqModel> {
  private static instance: DeleteFaqRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteFaqRepo()
    }
    return this.instance
  }

  onParse(data: any): FaqModel {
    return FaqModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteFaqApiService.getInstance()
  }
}

export { DeleteFaqRepo }
