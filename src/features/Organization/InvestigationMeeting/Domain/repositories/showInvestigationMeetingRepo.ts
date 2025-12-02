import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigationMeetingDetailsModel from '../../Data/models/investigationMeetingDetailsModel'
import { ShowInvestigationMeetingApiService } from '../../Data/apiServices/showInvestigationMeetingApiService'

class ShowInvestigationMeetingRepo extends RepoInterface<InvestigationMeetingDetailsModel> {
  private static instance: ShowInvestigationMeetingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInvestigationMeetingRepo()
    }
    return this.instance
  }

  onParse(data: any): InvestigationMeetingDetailsModel {
    return InvestigationMeetingDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowInvestigationMeetingApiService.getInstance()
  }
}

export { ShowInvestigationMeetingRepo }
