import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchTaskResultApiService } from '../../Data/apiServices/FetchTaskResultApiService'
import TaskFullResponseModel from '../../Data/models/FetchTaskResultModels/FullTaskResultModel'

class FetchTaskResultRepo extends RepoInterface<TaskFullResponseModel> {
  private static instance: FetchTaskResultRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchTaskResultRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TaskFullResponseModel {
    return TaskFullResponseModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchTaskResultApiService.getInstance()
  }
}

export { FetchTaskResultRepo }
