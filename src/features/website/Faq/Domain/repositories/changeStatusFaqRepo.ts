// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FaqModel from '../../Data/models/FaqModel'
import { ChangeStatusFaqApiService } from '../../Data/apiServices/changeStatusFaqApiService'



class ChangeStatusFaqRepo extends RepoInterface<FaqModel> {
  private static instance: ChangeStatusFaqRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusFaqRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): FaqModel {
    return FaqModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusFaqApiService.getInstance()
  }
}

export { ChangeStatusFaqRepo }
