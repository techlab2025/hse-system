// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ScopeModel from '../../Data/models/ScopeModel'
import { EditScopeApiService } from '../../Data/apiServices/editScopeApiService'


class EditScopeRepo extends RepoInterface<ScopeModel> {
  private static instance: EditScopeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditScopeRepo()
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
    return EditScopeApiService.getInstance()
  }
}

export { EditScopeRepo }
