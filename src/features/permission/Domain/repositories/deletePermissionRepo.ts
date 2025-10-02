// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PermissionModel from '../../Data/models/PermissionModel'
import { DeletePermissionApiService } from '../../Data/apiServices/deletePermissionApiService'

// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeletePermissionRepo extends RepoInterface<PermissionModel> {
  private static instance: DeletePermissionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePermissionRepo()
    }
    return this.instance
  }

  onParse(data: any): PermissionModel {
    return PermissionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeletePermissionApiService.getInstance()
  }
}

export { DeletePermissionRepo }
