import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import { ObjectiveProgressDetailsApiService } from '../../Data/apiServices/objectiveProgressDetailsApiService'
import ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'

class ObjectiveProgressDetailsRepo extends RepoInterface<ObjectiveProgressModel> {
  private static instance: ObjectiveProgressDetailsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ObjectiveProgressDetailsRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown>): ObjectiveProgressModel {
    return ObjectiveProgressModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ObjectiveProgressDetailsApiService.getInstance()
  }
}

export { ObjectiveProgressDetailsRepo }
