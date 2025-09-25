// import LangModel from '@/features/setting/SystemWork/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemWorkModel from '../../Data/models/SystemWorkModel'
import { AddSystemWorkApiService } from '../../Data/apiServices/addSystemWorkApiService'

class AddSystemWorkRepo extends RepoInterface<SystemWorkModel> {
  private static instance: AddSystemWorkRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemWorkRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SystemWorkModel {
    return SystemWorkModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSystemWorkApiService.getInstance()
  }
}

export { AddSystemWorkRepo }
