import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import { AddObjectiveProgressApiService } from '../../Data/apiServices/addObjectiveProgressApiService'
import ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'

class AddObjectiveProgressRepo extends RepoInterface<ObjectiveProgressModel> {
  private static instance: AddObjectiveProgressRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new AddObjectiveProgressRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown>): ObjectiveProgressModel {
    return ObjectiveProgressModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddObjectiveProgressApiService.getInstance()
  }
}

export { AddObjectiveProgressRepo }
