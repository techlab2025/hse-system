import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditVisitActivityApiService } from '../../Data/apiServices/editVisitActivityApiService'
import VisitActivityModel from '../../Data/models/VisitActivityModel'

class EditVisitActivityRepo extends RepoInterface<VisitActivityModel> {
  private static instance: EditVisitActivityRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditVisitActivityRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): VisitActivityModel {
    return VisitActivityModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditVisitActivityApiService.getInstance()
  }
}

export { EditVisitActivityRepo }
