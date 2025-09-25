// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import { DeleteClientOpinionApiService } from '../../Data/apiServices/deleteClientOpinionApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteClientOpinionRepo extends RepoInterface<ClientOpinionModel> {
  private static instance: DeleteClientOpinionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteClientOpinionRepo()
    }
    return this.instance
  }

  onParse(data: any): ClientOpinionModel {
    return ClientOpinionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteClientOpinionApiService.getInstance()
  }
}

export { DeleteClientOpinionRepo }
