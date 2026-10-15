import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import { EditObjectiveProgressApiService } from '../../Data/apiServices/editObjectiveProgressApiService'
import ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'

class EditObjectiveProgressRepo extends RepoInterface<ObjectiveProgressModel> {
  private static instance: EditObjectiveProgressRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditObjectiveProgressRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown>): ObjectiveProgressModel {
    return ObjectiveProgressModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditObjectiveProgressApiService.getInstance()
  }
}

export { EditObjectiveProgressRepo }
