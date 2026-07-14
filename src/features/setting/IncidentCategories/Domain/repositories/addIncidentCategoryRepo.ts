// import LangModel from '@/features/setting/IncidentCategory/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import { AddIncidentCategoryApiService } from '../../Data/apiServices/addIncidentCategoryApiService'

class AddIncidentCategoryRepo extends RepoInterface<IncidentCategoryModel> {
  private static instance: AddIncidentCategoryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddIncidentCategoryRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): IncidentCategoryModel {
    return IncidentCategoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddIncidentCategoryApiService.getInstance()
  }
}

export { AddIncidentCategoryRepo }
