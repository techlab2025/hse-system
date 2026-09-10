// import LangModel from '@/features/setting/DrillType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DrillTypeModel from '../../Data/models/DrillTypeModel'
import { AddDrillTypeClonesApiService } from '../../Data/apiServices/AddDrillTypeClonesApiService'

class AddDrillTypeCloneRepo extends RepoInterface<DrillTypeModel> {
  private static instance: AddDrillTypeCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDrillTypeCloneRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): DrillTypeModel {
    return DrillTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddDrillTypeClonesApiService.getInstance()
  }
}

export { AddDrillTypeCloneRepo }
