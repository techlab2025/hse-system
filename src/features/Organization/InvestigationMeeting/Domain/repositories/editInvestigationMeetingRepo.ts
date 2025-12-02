import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditInvestigationMeetingApiService } from '../../Data/apiServices/editInvestigationMeetingApiService'
import InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'

class EditInvestigationMeetingRepo extends RepoInterface<InvestigationMeetingModel> {
  private static instance: EditInvestigationMeetingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditInvestigationMeetingRepo()
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
    return EditInvestigationMeetingApiService.getInstance()
  }
}

export { EditInvestigationMeetingRepo }
