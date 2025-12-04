import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddInvestigatingResultApiService } from '../../../Data/apiServices/investigationResult/addInvestigatingResultApiService'
import InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'

class AddInvestigatingResultRepo extends RepoInterface<InvestegationResultModel> {
  private static instance: AddInvestigatingResultRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInvestigatingResultRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): InvestegationResultModel {
    return InvestegationResultModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddInvestigatingResultApiService.getInstance()
  }
}

export { AddInvestigatingResultRepo }
