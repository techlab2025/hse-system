import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigatingModel from '../../Data/models/investigatingModel'
import { DeleteInvestigatingApiService } from '../../Data/apiServices/deleteInvestigatingApiService'

class DeleteInvestigatingRepo extends RepoInterface<InvestigatingModel> {
  private static instance: DeleteInvestigatingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteInvestigatingRepo()
    }
    return this.instance
  }

  onParse(data: any): InvestigatingModel {
    return InvestigatingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteInvestigatingApiService.getInstance()
  }
}

export { DeleteInvestigatingRepo }
