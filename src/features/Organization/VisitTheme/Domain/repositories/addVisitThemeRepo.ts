import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddVisitThemeApiService } from '../../Data/apiServices/addVisitThemeApiService'
import VisitThemeModel from '../../Data/models/VisitThemeModel'

class AddVisitThemeRepo extends RepoInterface<VisitThemeModel> {
  private static instance: AddVisitThemeRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new AddVisitThemeRepo()
    return this.instance
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): VisitThemeModel {
    return VisitThemeModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return AddVisitThemeApiService.getInstance()
  }
}
export { AddVisitThemeRepo }
