// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PowerFullModel from '../../Data/models/PowerFullModel'
import { EditPowerFullApiService } from '../../Data/apiServices/editPowerFullApiService'



class EditPowerFullRepo extends RepoInterface<PowerFullModel> {
  private static instance: EditPowerFullRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditPowerFullRepo()
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
    return EditPowerFullApiService.getInstance()
  }
}

export { EditPowerFullRepo }
