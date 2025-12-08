import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RoleDetailsModel from '../../Data/models/RoleDetailsModel'
import { ShowRoleApiService } from '../../Data/apiServices/showRoleApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowRoleRepo extends RepoInterface<RoleDetailsModel> {
  private static instance: ShowRoleRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowRoleRepo()
    }
    return this.instance
  }

  onParse(data: any): RoleDetailsModel {
    return RoleDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowRoleApiService.getInstance()
  }
}

export { ShowRoleRepo }
