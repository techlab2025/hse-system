import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteVisitActivityApiService } from '../../Data/apiServices/deleteVisitActivityApiService'
import VisitActivityModel from '../../Data/models/VisitActivityModel'

class DeleteVisitActivityRepo extends RepoInterface<VisitActivityModel> {
  private static instance: DeleteVisitActivityRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteVisitActivityRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): VisitActivityModel {
    return VisitActivityModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteVisitActivityApiService.getInstance()
  }
}

export { DeleteVisitActivityRepo }
