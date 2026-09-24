import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditVisitCategoryApiService } from '../../Data/apiServices/editVisitCategoryApiService'
import VisitCategoryModel from '../../Data/models/VisitCategoryModel'

class EditVisitCategoryRepo extends RepoInterface<VisitCategoryModel> {
  private static instance: EditVisitCategoryRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new EditVisitCategoryRepo()
    return this.instance
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): VisitCategoryModel {
    return VisitCategoryModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return EditVisitCategoryApiService.getInstance()
  }
}
export { EditVisitCategoryRepo }
