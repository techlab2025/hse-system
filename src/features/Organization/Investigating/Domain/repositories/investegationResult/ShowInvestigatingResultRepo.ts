import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestegationResultDetailsModel from '../../../Data/models/investigationResult/InvestegationResulDetailsModel'
import { ShowInvestigatingResultApiService } from '../../../Data/apiServices/investigationResult/showInvestigatingResultApiService'

class ShowInvestigatingResultRepo extends RepoInterface<InvestegationResultDetailsModel> {
  private static instance: ShowInvestigatingResultRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInvestigatingResultRepo()
    }
    return this.instance
  }



  onParse(data: any): InvestegationResultDetailsModel {
    return InvestegationResultDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowInvestigatingResultApiService.getInstance()
  }
}

export { ShowInvestigatingResultRepo }
