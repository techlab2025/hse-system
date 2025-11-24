import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigatingModel from '../../Data/models/investigatingModel'
import { DisInvestigatingApiService } from '../../Data/apiServices/disInvestigatingApiService'

class DisActiveInvestigatingRepo extends RepoInterface<InvestigatingModel> {
  private static instance: DisActiveInvestigatingRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveInvestigatingRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): InvestigatingModel {
    return InvestigatingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisInvestigatingApiService.getInstance()
  }
}

export { DisActiveInvestigatingRepo }
