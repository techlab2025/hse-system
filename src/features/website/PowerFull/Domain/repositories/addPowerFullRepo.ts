// import LangModel from '@/features/setting/PowerFull/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PowerFullModel from '../../Data/models/PowerFullModel'
import { AddPowerFullApiService } from '../../Data/apiServices/addPowerFullApiService'

class AddPowerFullRepo extends RepoInterface<PowerFullModel> {
  private static instance: AddPowerFullRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPowerFullRepo()
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
    return AddPowerFullApiService.getInstance()
  }
}

export { AddPowerFullRepo }
