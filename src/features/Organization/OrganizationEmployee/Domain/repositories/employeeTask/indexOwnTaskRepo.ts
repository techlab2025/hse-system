import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import { indexOwnTaskApiService } from '../../../Data/apiServices/employeeTask/indexOwnTaskApiService'

class indexOwnTaskRepo extends RepoInterface<IndexOwnTaskModel[]> {
  private static instance: indexOwnTaskRepo

  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new indexOwnTaskRepo()
    }
    return this.instance
  }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>): IndexOwnTaskModel[] {
    const nestedData = Array.isArray(data) ? data : data.data
    const tasks = Array.isArray(nestedData) ? nestedData : []
    return tasks.map((item) => IndexOwnTaskModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return indexOwnTaskApiService.getInstance()
  }
}

export { indexOwnTaskRepo }
