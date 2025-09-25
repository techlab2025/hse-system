// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PowerFullModel from '../../Data/models/PowerFullModel'
import { DeletePowerFullApiService } from '../../Data/apiServices/deletePowerFullApiService'


// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeletePowerFullRepo extends RepoInterface<PowerFullModel> {
  private static instance: DeletePowerFullRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePowerFullRepo()
    }
    return this.instance
  }

  onParse(data: any): PowerFullModel {
    return PowerFullModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeletePowerFullApiService.getInstance()
  }
}

export { DeletePowerFullRepo }
