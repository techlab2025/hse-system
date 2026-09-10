import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DrillTypeModel from '../../Data/models/DrillTypeModel'
import { EditDrillTypeApiService } from '../../Data/apiServices/editDrillTypeApiService'


class EditDrillTypeRepo extends RepoInterface<DrillTypeModel> {
  private static instance: EditDrillTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditDrillTypeRepo()
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
    return EditDrillTypeApiService.getInstance()
  }
}

export { EditDrillTypeRepo }
