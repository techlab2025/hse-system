import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InspectionModel from '../../Data/models/InspectionModel'
import { DeleteInspectionApiService } from '../../Data/apiServices/deleteInspectionApiService'

class DeleteInspectionRepo extends RepoInterface<InspectionModel> {
  private static instance: DeleteInspectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteInspectionRepo()
    }
    return this.instance
  }

  onParse(data: any): InspectionModel {
    return InspectionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteInspectionApiService.getInstance()
  }
}

export { DeleteInspectionRepo }
