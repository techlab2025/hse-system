import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddInductionApiService } from '../../../Data/apiServices/Induction/addInductionApiService'
import InductionModel from '../../../Data/models/Induction/InductionModel'

export default class AddInductionRepo extends RepoInterface<InductionModel> {
  private static instance: AddInductionRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new AddInductionRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): InductionModel {
    return InductionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddInductionApiService.getInstance()
  }
}
