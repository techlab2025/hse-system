import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddVisitCategoryApiService } from '../../Data/apiServices/addVisitCategoryApiService'
import VisitCategoryModel from '../../Data/models/VisitCategoryModel'

class AddVisitCategoryRepo extends RepoInterface<VisitCategoryModel> {
  private static instance: AddVisitCategoryRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new AddVisitCategoryRepo()
    return this.instance
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): VisitCategoryModel {
    return VisitCategoryModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return AddVisitCategoryApiService.getInstance()
  }
}
export { AddVisitCategoryRepo }
