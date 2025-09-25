// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemWorkModel from '../../Data/models/SystemWorkModel'
import { ChangeStatusSystemWorkApiService } from '../../Data/apiServices/changeStatusSystemWorkApiService'


class ChangeStatusSystemWorkRepo extends RepoInterface<SystemWorkModel> {
  private static instance: ChangeStatusSystemWorkRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusSystemWorkRepo()
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
    return ChangeStatusSystemWorkApiService.getInstance()
  }
}

export { ChangeStatusSystemWorkRepo }
