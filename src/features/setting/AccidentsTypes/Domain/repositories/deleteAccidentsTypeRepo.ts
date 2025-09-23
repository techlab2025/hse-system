// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AccidentsTypeModel from '../../Data/models/AccidentsTypeModel'
import { DeleteAccidentsTypeApiService } from '../../Data/apiServices/deleteAccidentsTypeApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteAccidentsTypeRepo extends RepoInterface<AccidentsTypeModel> {
  private static instance: DeleteAccidentsTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAccidentsTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): AccidentsTypeModel {
    return AccidentsTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteAccidentsTypeApiService.getInstance()
  }
}

export { DeleteAccidentsTypeRepo }
