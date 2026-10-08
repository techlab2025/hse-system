import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexVisitCategoryApiService } from '../../Data/apiServices/indexVisitCategoryApiService'
import VisitCategoryModel from '../../Data/models/VisitCategoryModel'

class IndexVisitCategoryRepo extends RepoInterface<VisitCategoryModel[]> {
  private static instance: IndexVisitCategoryRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new IndexVisitCategoryRepo()
    return this.instance
  }
  override get hasPagination(): boolean {
    return true
  }
  onParse(data: any): VisitCategoryModel[] {
    return data.map((item: any) => VisitCategoryModel.fromMap(item))
  }
  get serviceInstance(): ServicesInterface {
    return IndexVisitCategoryApiService.getInstance()
  }
}
export { IndexVisitCategoryRepo }
