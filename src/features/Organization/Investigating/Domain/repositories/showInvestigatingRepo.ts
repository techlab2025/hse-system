import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigatingDetailsModel from '../../Data/models/investigatingDetailsModel'
import { ShowInvestigatingApiService } from '../../Data/apiServices/showInvestigatingApiService'

class ShowInvestigatingRepo extends RepoInterface<InvestigatingDetailsModel> {
  private static instance: ShowInvestigatingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInvestigatingRepo()
    }
    return this.instance
  }

  onParse(data: any): InvestigatingDetailsModel {
    return InvestigatingDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowInvestigatingApiService.getInstance()
  }
}

export { ShowInvestigatingRepo }
