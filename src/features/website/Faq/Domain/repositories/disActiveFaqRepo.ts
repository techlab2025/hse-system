// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FaqModel from '../../Data/models/FaqModel'
import { DisFaqApiService } from '../../Data/apiServices/disActiveFaqApiService'

class DisActiveFaqRepo extends RepoInterface<FaqModel> {
  private static instance: DisActiveFaqRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveFaqRepo()
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
    return DisFaqApiService.getInstance()
  }
}

export { DisActiveFaqRepo }
