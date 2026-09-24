import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddVisitActivityApiService } from '../../Data/apiServices/addVisitActivityApiService'
import VisitActivityModel from '../../Data/models/VisitActivityModel'

class AddVisitActivityRepo extends RepoInterface<VisitActivityModel> {
  private static instance: AddVisitActivityRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new AddVisitActivityRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): VisitActivityModel {
    return VisitActivityModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddVisitActivityApiService.getInstance()
  }
}

export { AddVisitActivityRepo }
