// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PowerFullModel from '../../Data/models/PowerFullModel'
import { ChangeStatusPowerFullApiService } from '../../Data/apiServices/changeStatusPowerFullApiService'


class ChangeStatusPowerFullRepo extends RepoInterface<PowerFullModel> {
  private static instance: ChangeStatusPowerFullRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusPowerFullRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PowerFullModel {
    return PowerFullModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusPowerFullApiService.getInstance()
  }
}

export { ChangeStatusPowerFullRepo }
