import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AdminModel from '../../Data/models/index_admin_model'
import { AddAdminApiService } from '../../Data/apiServices/add_admin_api_service'

class AddAdminRepo extends RepoInterface<AdminModel> {
  private static instance: AddAdminRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAdminRepo()
    }
    return this.instance
  }

  onParse(data: any): AdminModel {
    return AdminModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddAdminApiService.getInstance()
  }
}

export { AddAdminRepo }
