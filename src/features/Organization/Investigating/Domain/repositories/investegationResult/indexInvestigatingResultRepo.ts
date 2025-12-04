import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'
import { IndexInvestigatingResultApiService } from '../../../Data/apiServices/investigationResult/indexInvestigatingResultApiService'

class IndexInvestigatingResultRepo extends RepoInterface<InvestegationResultModel[]> {
  private static instance: IndexInvestigatingResultRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInvestigatingResultRepo()
    }
    return this.instance
  }


  onParse(data: any): InvestegationResultModel[] {
    return data.map((item: any) => InvestegationResultModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexInvestigatingResultApiService.getInstance()
  }
}

export { IndexInvestigatingResultRepo }
