// import LangModel from '@/features/setting/Permission/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PermissionModel from '../../Data/models/PermissionModel'
import { AddPermissionApiService } from '../../Data/apiServices/addPermissionApiService'

class AddPermissionRepo extends RepoInterface<PermissionModel> {
  private static instance: AddPermissionRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPermissionRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PermissionModel {
    return PermissionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddPermissionApiService.getInstance()
  }
}

export { AddPermissionRepo }
