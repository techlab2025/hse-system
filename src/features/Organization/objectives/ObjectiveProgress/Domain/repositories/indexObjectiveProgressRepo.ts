import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import { IndexObjectiveProgressApiService } from '../../Data/apiServices/indexObjectiveProgressApiService'
import ObjectiveProgressHistoryModel from '../../Data/models/objectiveProgressHistoryModel'

class IndexObjectiveProgressRepo extends RepoInterface<ObjectiveProgressHistoryModel> {
  private static instance: IndexObjectiveProgressRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexObjectiveProgressRepo()
    return this.instance
  }

  onParse(
    data: Record<string, unknown> | Record<string, unknown>[],
  ): ObjectiveProgressHistoryModel {
    return ObjectiveProgressHistoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return IndexObjectiveProgressApiService.getInstance()
  }
}

export { IndexObjectiveProgressRepo }
