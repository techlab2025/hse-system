// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RootCausesModel from '../../Data/models/RootCausesModel'
import { EditRootCausesApiService } from '../../Data/apiServices/editRootCausesApiService'

class EditRootCausesRepo extends RepoInterface<RootCausesModel> {
  private static instance: EditRootCausesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditRootCausesRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): RootCausesModel {
    return RootCausesModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditRootCausesApiService.getInstance()
  }
}

export { EditRootCausesRepo }
