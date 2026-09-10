import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DrillTypeModel from '../../Data/models/DrillTypeModel'
import { DeleteDrillTypeApiService } from '../../Data/apiServices/deleteDrillTypeApiService'

class DeleteDrillTypeRepo extends RepoInterface<DrillTypeModel> {
  private static instance: DeleteDrillTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteDrillTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): DrillTypeModel {
    return DrillTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteDrillTypeApiService.getInstance()
  }
}

export { DeleteDrillTypeRepo }
