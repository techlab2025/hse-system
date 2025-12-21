import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddScopeApiService } from '../../Data/apiServices/addScopeApiService'
import ScopeModel from '../../Data/models/ScopeModel'

class AddScopeRepo extends RepoInterface<ScopeModel> {
  private static instance: AddScopeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddScopeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ScopeModel {
    return ScopeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddScopeApiService.getInstance()
  }
}

export { AddScopeRepo }
