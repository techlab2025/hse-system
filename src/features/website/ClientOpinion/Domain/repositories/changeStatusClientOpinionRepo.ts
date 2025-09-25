// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import { ChangeStatusClientOpinionApiService } from '../../Data/apiServices/changeStatusClientOpinionApiService'

class ChangeStatusClientOpinionRepo extends RepoInterface<ClientOpinionModel> {
  private static instance: ChangeStatusClientOpinionRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusClientOpinionRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ClientOpinionModel {
    return ClientOpinionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusClientOpinionApiService.getInstance()
  }
}

export { ChangeStatusClientOpinionRepo }
