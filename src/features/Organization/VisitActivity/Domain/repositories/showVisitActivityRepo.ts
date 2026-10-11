import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowVisitActivityApiService } from '../../Data/apiServices/showVisitActivityApiService'
import VisitActivityDetailsModel from '../../Data/models/VisitActivityDetailsModel'

class ShowVisitActivityRepo extends RepoInterface<VisitActivityDetailsModel> {
  private static instance: ShowVisitActivityRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitActivityRepo()
    return this.instance
  }

  onParse(data: any): VisitActivityDetailsModel {
    return VisitActivityDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowVisitActivityApiService.getInstance()
  }
}

export { ShowVisitActivityRepo }
