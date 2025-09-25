// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemWorkModel from '../../Data/models/SystemWorkModel'
import { DeleteSystemWorkApiService } from '../../Data/apiServices/deleteSystemWorkApiService'



// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteSystemWorkRepo extends RepoInterface<SystemWorkModel> {
  private static instance: DeleteSystemWorkRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemWorkRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemWorkModel {
    return SystemWorkModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteSystemWorkApiService.getInstance()
  }
}

export { DeleteSystemWorkRepo }
