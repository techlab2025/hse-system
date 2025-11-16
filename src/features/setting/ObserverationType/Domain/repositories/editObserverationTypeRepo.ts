import { EditObserverationTypeApiService } from '@/features/setting/ObserverationType/Data/apiServices/editObserverationTypeApiService.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'

class EditObserverationTypeRepo extends RepoInterface<ObserverationTypeModel> {
  private static instance: EditObserverationTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditObserverationTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): ObserverationTypeModel {
    return ObserverationTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditObserverationTypeApiService.getInstance()
  }
}

export { EditObserverationTypeRepo }
