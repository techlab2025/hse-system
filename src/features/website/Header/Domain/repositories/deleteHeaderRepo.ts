// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HeaderModel from '../../Data/models/HeaderModel'
import { DeleteHeaderApiService } from '../../Data/apiServices/deleteHeaderApiService'

// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteHeaderRepo extends RepoInterface<HeaderModel> {
  private static instance: DeleteHeaderRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHeaderRepo()
    }
    return this.instance
  }

  onParse(data: any): HeaderModel {
    return HeaderModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHeaderApiService.getInstance()
  }
}

export { DeleteHeaderRepo }
