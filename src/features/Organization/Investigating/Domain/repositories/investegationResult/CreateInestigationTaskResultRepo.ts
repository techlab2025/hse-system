import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'
import { CreateInvestigationTaskResultApiService } from '../../../Data/apiServices/investigationResult/CreateInvesteationTaskResultApiService'

class CreateInvestigationTaskResultRepo extends RepoInterface<InvestegationResultModel> {
  private static instance: CreateInvestigationTaskResultRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateInvestigationTaskResultRepo()
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
    return CreateInvestigationTaskResultApiService.getInstance()
  }
}

export { CreateInvestigationTaskResultRepo }
