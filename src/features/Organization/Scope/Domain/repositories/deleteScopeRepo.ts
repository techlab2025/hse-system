import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ScopeModel from '../../Data/models/ScopeModel'
import { DeleteScopeApiService } from '../../Data/apiServices/deleteScopeApiService'

class DeleteScopeRepo extends RepoInterface<ScopeModel> {
  private static instance: DeleteScopeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteScopeRepo()
    }
    return this.instance
  }

  onParse(data: any): ScopeModel {
    return ScopeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteScopeApiService.getInstance()
  }
}

export { DeleteScopeRepo }
