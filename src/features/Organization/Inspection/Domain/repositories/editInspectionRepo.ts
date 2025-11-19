import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InspectionModel from '../../Data/models/InspectionModel'
import { EditInspectionApiService } from '../../Data/apiServices/editInspectionApiService'

class EditInspectionRepo extends RepoInterface<InspectionModel> {
  private static instance: EditInspectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditInspectionRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): InspectionModel {
    return InspectionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditInspectionApiService.getInstance()
  }
}

export { EditInspectionRepo }
