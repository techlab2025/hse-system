import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowVisitCategoryApiService } from '../../Data/apiServices/showVisitCategoryApiService'
import VisitCategoryDetailsModel from '../../Data/models/VisitCategoryDetailsModel'

class ShowVisitCategoryRepo extends RepoInterface<VisitCategoryDetailsModel> {
  private static instance: ShowVisitCategoryRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitCategoryRepo()
    return this.instance
  }
  onParse(data: any): VisitCategoryDetailsModel {
    return VisitCategoryDetailsModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return ShowVisitCategoryApiService.getInstance()
  }
}
export { ShowVisitCategoryRepo }
