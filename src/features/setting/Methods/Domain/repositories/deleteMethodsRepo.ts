// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MethodsModel from '../../Data/models/MethodModel'
import { DeleteMethodsApiService } from '../../Data/apiServices/deleteMethodsApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteMethodsRepo extends RepoInterface<MethodsModel> {
  private static instance: DeleteMethodsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteMethodsRepo()
    }
    return this.instance
  }

  onParse(data: any): MethodsModel {
    return MethodsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteMethodsApiService.getInstance()
  }
}

export { DeleteMethodsRepo }
