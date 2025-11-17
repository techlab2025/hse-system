import { AddObserverationTypeApiService } from '@/features/setting/ObserverationType/Data/apiServices/addObserverationTypeApiService'
// import LangModel from '@/features/setting/ObserverationType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'

class AddObserverationTypeRepo extends RepoInterface<ObserverationTypeModel> {
  private static instance: AddObserverationTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddObserverationTypeRepo()
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
    return AddObserverationTypeApiService.getInstance()
  }
}

export { AddObserverationTypeRepo }
