import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PPEToolModel from '../../Data/models/PPEToolModel'
import { DeletePPEToolApiService } from '../../Data/apiServices/deletePPEToolApiService'

class DeletePPEToolRepo extends RepoInterface<PPEToolModel> {
  private static instance: DeletePPEToolRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePPEToolRepo()
    }
    return this.instance
  }

  onParse(data: any): PPEToolModel {
    return PPEToolModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeletePPEToolApiService.getInstance()
  }
}

export { DeletePPEToolRepo }
