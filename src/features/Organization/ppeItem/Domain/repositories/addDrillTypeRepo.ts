// import LangModel from '@/features/setting/DrillType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddDrillTypeApiService } from '../../Data/apiServices/addDrillTypeApiService'
import DrillTypeModel from '../../Data/models/DrillTypeModel'

class AddDrillTypeRepo extends RepoInterface<DrillTypeModel> {
  private static instance: AddDrillTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDrillTypeRepo()
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
    return AddDrillTypeApiService.getInstance()
  }
}

export { AddDrillTypeRepo }
