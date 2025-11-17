import { DeleteObserverationTypeApiService } from '@/features/setting/ObserverationType/Data/apiServices/deleteObserverationTypeApiService'
// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'

class DeleteObserverationTypeRepo extends RepoInterface<ObserverationTypeModel> {
  private static instance: DeleteObserverationTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteObserverationTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): ObserverationTypeModel {
    return ObserverationTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteObserverationTypeApiService.getInstance()
  }
}

export { DeleteObserverationTypeRepo }
