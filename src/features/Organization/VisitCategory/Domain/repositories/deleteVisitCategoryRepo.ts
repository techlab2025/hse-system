import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteVisitCategoryApiService } from '../../Data/apiServices/deleteVisitCategoryApiService'
import VisitCategoryModel from '../../Data/models/VisitCategoryModel'

class DeleteVisitCategoryRepo extends RepoInterface<VisitCategoryModel> {
  private static instance: DeleteVisitCategoryRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new DeleteVisitCategoryRepo()
    return this.instance
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): VisitCategoryModel {
    return VisitCategoryModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return DeleteVisitCategoryApiService.getInstance()
  }
}
export { DeleteVisitCategoryRepo }
