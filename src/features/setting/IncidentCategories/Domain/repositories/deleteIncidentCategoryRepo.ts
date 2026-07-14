// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import { DeleteIncidentCategoryApiService } from '../../Data/apiServices/deleteIncidentCategoryApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteIncidentCategoryRepo extends RepoInterface<IncidentCategoryModel> {
  private static instance: DeleteIncidentCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteIncidentCategoryRepo()
    }
    return this.instance
  }

  onParse(data: any): IncidentCategoryModel {
    return IncidentCategoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteIncidentCategoryApiService.getInstance()
  }
}

export { DeleteIncidentCategoryRepo }
