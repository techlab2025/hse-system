// import LangModel from '@/features/setting/ClientOpinion/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import { AddClientOpinionApiService } from '../../Data/apiServices/addClientOpinionApiService'

class AddClientOpinionRepo extends RepoInterface<ClientOpinionModel> {
  private static instance: AddClientOpinionRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddClientOpinionRepo()
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
    return AddClientOpinionApiService.getInstance()
  }
}

export { AddClientOpinionRepo }
