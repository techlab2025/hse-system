import { DeleteRootCausesApiService } from '@/features/setting/RootCauses/Data/apiServices/deleteRootCausesApiService'
// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RootCausesModel from '../../Data/models/RootCausesModel'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'


class DeleteRootCausesRepo extends RepoInterface<RootCausesModel> {
  private static instance: DeleteRootCausesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteRootCausesRepo()
    }
    return this.instance
  }

  onParse(data: any): RootCausesModel {
    return RootCausesModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteRootCausesApiService.getInstance()
  }
}

export { DeleteRootCausesRepo }
