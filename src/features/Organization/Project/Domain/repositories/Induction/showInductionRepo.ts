import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowInductionApiService } from '../../../Data/apiServices/Induction/showInductionApiService'
import InductionDetailsModel from '../../../Data/models/Induction/InductionDetailsModel'

export default class ShowInductionRepo extends RepoInterface<InductionDetailsModel> {
  private static instance: ShowInductionRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowInductionRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown>): InductionDetailsModel {
    return InductionDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowInductionApiService.getInstance()
  }
}
