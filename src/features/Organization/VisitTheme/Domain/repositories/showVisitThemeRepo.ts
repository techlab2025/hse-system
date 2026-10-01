import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowVisitThemeApiService } from '../../Data/apiServices/showVisitThemeApiService'
import VisitThemeDetailsModel from '../../Data/models/VisitThemeDetailsModel'

class ShowVisitThemeRepo extends RepoInterface<VisitThemeDetailsModel> {
  private static instance: ShowVisitThemeRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitThemeRepo()
    return this.instance
  }
  onParse(data: any): VisitThemeDetailsModel {
    return VisitThemeDetailsModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return ShowVisitThemeApiService.getInstance()
  }
}
export { ShowVisitThemeRepo }
