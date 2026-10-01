import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditVisitThemeApiService } from '../../Data/apiServices/editVisitThemeApiService'
import VisitThemeModel from '../../Data/models/VisitThemeModel'

class EditVisitThemeRepo extends RepoInterface<VisitThemeModel> {
  private static instance: EditVisitThemeRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new EditVisitThemeRepo()
    return this.instance
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): VisitThemeModel {
    return VisitThemeModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return EditVisitThemeApiService.getInstance()
  }
}
export { EditVisitThemeRepo }
