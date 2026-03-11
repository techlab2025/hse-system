import { AddObserverationTypeApiService } from '@/features/setting/ObserverationType/Data/apiServices/addObserverationTypeApiService'
// import LangModel from '@/features/setting/ObserverationType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import { AddSystemObserverationTypeApiService } from '../../Data/apiServices/addSystemObserverationTypeApiService'

class AddSystemObserverationTypeRepo extends RepoInterface<ObserverationTypeModel> {
  private static instance: AddSystemObserverationTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemObserverationTypeRepo()
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
    return AddSystemObserverationTypeApiService.getInstance()
  }
}

export { AddSystemObserverationTypeRepo }
