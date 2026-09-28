import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowProjectSummaryDetailsApiService } from '../../Data/apiServices/ShowProjectSummaryDetailsApiService'
import ShowProjectSummaryDetailsModel from '../../Data/models/ShowProjectSummaryDetailsModel'

class ShowProjectSummaryDetailsRepo extends RepoInterface<ShowProjectSummaryDetailsModel> {
  private static instance: ShowProjectSummaryDetailsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectSummaryDetailsRepo()
    }
    return this.instance
  }

  onParse(data: Record<string, unknown>): ShowProjectSummaryDetailsModel {
    return ShowProjectSummaryDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowProjectSummaryDetailsApiService.getInstance()
  }
}

export { ShowProjectSummaryDetailsRepo }
