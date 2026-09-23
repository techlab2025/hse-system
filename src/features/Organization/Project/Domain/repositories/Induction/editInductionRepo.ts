import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditInductionApiService } from '../../../Data/apiServices/Induction/editInductionApiService'
import InductionModel from '../../../Data/models/Induction/InductionModel'

export default class EditInductionRepo extends RepoInterface<InductionModel> {
  private static instance: EditInductionRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditInductionRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): InductionModel {
    return InductionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditInductionApiService.getInstance()
  }
}
