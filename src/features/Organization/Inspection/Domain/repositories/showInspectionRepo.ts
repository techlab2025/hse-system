import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InspectionDetailsModel from '../../Data/models/InspectionDetailsModel'
import { ShowInspectionApiService } from '../../Data/apiServices/showInspectionApiService'

class ShowInspectionRepo extends RepoInterface<InspectionDetailsModel> {
  private static instance: ShowInspectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInspectionRepo()
    }
    return this.instance
  }

  onParse(data: any): InspectionDetailsModel {
    return InspectionDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowInspectionApiService.getInstance()
  }
}

export { ShowInspectionRepo }
