import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncedantModel from '../../Data/models/IncedantModel'
import { DeleteIncedantApiService } from '../../Data/apiServices/deleteIncedantApiService'

class DeleteIncedantRepo extends RepoInterface<IncedantModel> {
  private static instance: DeleteIncedantRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteIncedantRepo()
    }
    return this.instance
  }

  onParse(data: any): IncedantModel {
    return IncedantModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteIncedantApiService.getInstance()
  }
}

export { DeleteIncedantRepo }
