import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexInductionApiService } from '../../../Data/apiServices/Induction/indexInductionApiService'
import InductionModel from '../../../Data/models/Induction/InductionModel'

export default class IndexInductionRepo extends RepoInterface<InductionModel[]> {
  private static instance: IndexInductionRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexInductionRepo()
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): InductionModel[] {
    return Array.isArray(data) ? data.map((item) => InductionModel.fromMap(item)) : []
  }

  get serviceInstance(): ServicesInterface {
    return IndexInductionApiService.getInstance()
  }
}
