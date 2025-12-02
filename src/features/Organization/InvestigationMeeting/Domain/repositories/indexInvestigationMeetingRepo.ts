import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'
import { IndexInvestigationMeetingApiService } from '../../Data/apiServices/indexInvestigationMeetingApiService'

class IndexInvestigationMeetingRepo extends RepoInterface<InvestigationMeetingModel[]> {
  private static instance: IndexInvestigationMeetingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInvestigationMeetingRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): InvestigationMeetingModel[] {
    return data.map((item: any) => InvestigationMeetingModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexInvestigationMeetingApiService.getInstance()
  }
}

export { IndexInvestigationMeetingRepo }
