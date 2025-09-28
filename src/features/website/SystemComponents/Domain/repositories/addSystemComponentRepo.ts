// import LangModel from '@/features/setting/Service/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemComponentModel from '../../Data/models/SystemComponentModel'
import { AddSystemComponentApiService } from '../../Data/apiServices/addSystemComponentApiService'

class AddSystemComponentRepo extends RepoInterface<SystemComponentModel> {
  private static instance: AddSystemComponentRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemComponentRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SystemComponentModel {
    return SystemComponentModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSystemComponentApiService.getInstance()
  }
}

export { AddSystemComponentRepo }
