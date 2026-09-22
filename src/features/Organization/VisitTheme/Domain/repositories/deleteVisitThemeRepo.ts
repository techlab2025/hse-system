import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteVisitThemeApiService } from '../../Data/apiServices/deleteVisitThemeApiService'
import VisitThemeModel from '../../Data/models/VisitThemeModel'

class DeleteVisitThemeRepo extends RepoInterface<VisitThemeModel> {
  private static instance: DeleteVisitThemeRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new DeleteVisitThemeRepo()
    return this.instance
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): VisitThemeModel {
    return VisitThemeModel.fromMap(data)
  }
  get serviceInstance(): ServicesInterface {
    return DeleteVisitThemeApiService.getInstance()
  }
}
export { DeleteVisitThemeRepo }
