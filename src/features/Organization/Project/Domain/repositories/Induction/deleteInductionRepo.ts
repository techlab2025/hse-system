import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteInductionApiService } from '../../../Data/apiServices/Induction/deleteInductionApiService'
import InductionModel from '../../../Data/models/Induction/InductionModel'

export default class DeleteInductionRepo extends RepoInterface<InductionModel> {
  private static instance: DeleteInductionRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteInductionRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): InductionModel {
    return InductionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteInductionApiService.getInstance()
  }
}
