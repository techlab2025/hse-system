// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemComponentModel from '../../Data/models/SystemComponentModel'
import { DeleteSystemComponentApiService } from '../../Data/apiServices/deleteSystemComponentApiService'

class DeleteSystemComponentRepo extends RepoInterface<SystemComponentModel> {
  private static instance: DeleteSystemComponentRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemComponentRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemComponentModel {
    return SystemComponentModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteSystemComponentApiService.getInstance()
  }
}

export { DeleteSystemComponentRepo }
