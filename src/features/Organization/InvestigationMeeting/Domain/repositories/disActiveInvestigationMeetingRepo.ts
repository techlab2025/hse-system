import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'
import { DisInvestigationMeetingApiService } from '../../Data/apiServices/disInvestigationMeetingApiService'

class DisActiveInvestigationMeetingRepo extends RepoInterface<InvestigationMeetingModel> {
  private static instance: DisActiveInvestigationMeetingRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveInvestigationMeetingRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): InvestigationMeetingModel {
    return InvestigationMeetingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisInvestigationMeetingApiService.getInstance()
  }
}

export { DisActiveInvestigationMeetingRepo }
