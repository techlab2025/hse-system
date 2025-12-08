import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RoleModel from '../../Data/models/RoleModel'
import { AddRoleApiService } from '../../Data/apiServices/addRoleApiService'

class AddRoleRepo extends RepoInterface<RoleModel> {
  private static instance: AddRoleRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddRoleRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): RoleModel {
    return RoleModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddRoleApiService.getInstance()
  }
}

export { AddRoleRepo }
