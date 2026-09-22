import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexVisitThemeApiService } from '../../Data/apiServices/indexVisitThemeApiService'
import VisitThemeModel from '../../Data/models/VisitThemeModel'

class IndexVisitThemeRepo extends RepoInterface<VisitThemeModel[]> {
  private static instance: IndexVisitThemeRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new IndexVisitThemeRepo()
    return this.instance
  }
  override get hasPagination(): boolean {
    return true
  }
  onParse(data: any): VisitThemeModel[] {
    return data.map((item: any) => VisitThemeModel.fromMap(item))
  }
  get serviceInstance(): ServicesInterface {
    return IndexVisitThemeApiService.getInstance()
  }
}
export { IndexVisitThemeRepo }
