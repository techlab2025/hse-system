import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'
import { DeleteInvestigationMeetingApiService } from '../../Data/apiServices/deleteInvestigationMeetingApiService'

class DeleteInvestigationMeetingRepo extends RepoInterface<InvestigationMeetingModel> {
  private static instance: DeleteInvestigationMeetingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteInvestigationMeetingRepo()
    }
    return this.instance
  }

  onParse(data: any): InvestigationMeetingModel {
    return InvestigationMeetingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteInvestigationMeetingApiService.getInstance()
  }
}

export { DeleteInvestigationMeetingRepo }
