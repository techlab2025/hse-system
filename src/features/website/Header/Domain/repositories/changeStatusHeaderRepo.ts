// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HeaderModel from '../../Data/models/HeaderModel'
import { ChangeStatusHeaderApiService } from '../../Data/apiServices/changeStatusHeaderApiService'


class ChangeStatusHeaderRepo extends RepoInterface<HeaderModel> {
  private static instance: ChangeStatusHeaderRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusHeaderRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HeaderModel {
    return HeaderModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusHeaderApiService.getInstance()
  }
}

export { ChangeStatusHeaderRepo }
