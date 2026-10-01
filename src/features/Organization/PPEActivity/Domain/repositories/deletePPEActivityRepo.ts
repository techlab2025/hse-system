import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PPEActivityModel from '../../Data/models/PPEActivityModel'
import { DeletePPEActivityApiService } from '../../Data/apiServices/deletePPEActivityApiService'

class DeletePPEActivityRepo extends RepoInterface<PPEActivityModel> {
  private static instance: DeletePPEActivityRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePPEActivityRepo()
    }
    return this.instance
  }

  onParse(data: any): PPEActivityModel {
    return PPEActivityModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeletePPEActivityApiService.getInstance()
  }
}

export { DeletePPEActivityRepo }
