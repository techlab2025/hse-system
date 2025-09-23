// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryModel from '../../Data/models/FactoryModel'
import { DeleteFactoryApiService } from '../../Data/apiServices/deleteFactoryApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteFactoryRepo extends RepoInterface<FactoryModel> {
  private static instance: DeleteFactoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteFactoryRepo()
    }
    return this.instance
  }

  onParse(data: any): FactoryModel {
    return FactoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteFactoryApiService.getInstance()
  }
}

export { DeleteFactoryRepo }
