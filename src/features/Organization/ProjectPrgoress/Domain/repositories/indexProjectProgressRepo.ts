import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectProgressModel from '../../Data/models/ProjectProgressModel'
import { IndexProjectProgressApiService } from '../../Data/apiServices/indexProjectProgressApiService'

class IndexProjectProgressRepo extends RepoInterface<ProjectProgressModel> {
  private static instance: IndexProjectProgressRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectProgressRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ProjectProgressModel {
    return ProjectProgressModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return IndexProjectProgressApiService.getInstance()
  }
}

export { IndexProjectProgressRepo }
