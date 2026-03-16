import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigatingModel from '../../Data/models/investigatingModel'
import { CloseInvestigatingApiService } from '../../Data/apiServices/CloseInvestigatingApiService'

class CloseInvestigatingRepo extends RepoInterface<InvestigatingModel> {
  private static instance: CloseInvestigatingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CloseInvestigatingRepo()
    }
    return this.instance
  }

  onParse(data: any): InvestigatingModel {
    return InvestigatingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CloseInvestigatingApiService.getInstance()
  }
}

export { CloseInvestigatingRepo }
