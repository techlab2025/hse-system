import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PTWTypeModel from '../../Data/models/PTWTypeModel'
import { DeletePTWTypeApiService } from '../../Data/apiServices/deletePTWTypeApiService'

class DeletePTWTypeRepo extends RepoInterface<PTWTypeModel> {
  private static instance: DeletePTWTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePTWTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): PTWTypeModel {
    return PTWTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeletePTWTypeApiService.getInstance()
  }
}

export { DeletePTWTypeRepo }
