import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PermissionDetailsModel from '../../Data/models/PermissionDetailsModel'
import { ShowPermissionApiService } from '../../Data/apiServices/showPermissionApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowPermissionRepo extends RepoInterface<PermissionDetailsModel> {
  private static instance: ShowPermissionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPermissionRepo()
    }
    return this.instance
  }

  onParse(data: any): PermissionDetailsModel {
    return PermissionDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPermissionApiService.getInstance()
  }
}

export { ShowPermissionRepo }
