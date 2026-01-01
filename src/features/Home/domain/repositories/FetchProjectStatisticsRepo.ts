import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchProjectStatisticsApiService } from '../../data/ApiService/FetchProjectStatisticsApiService'
import ProjectStatisticsModel from '../../data/Model/ProjectStatisticsModel'

class FetchProjectStatisticsRepo extends RepoInterface<ProjectStatisticsModel> {
  private static instance: FetchProjectStatisticsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectStatisticsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ProjectStatisticsModel {
    return ProjectStatisticsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchProjectStatisticsApiService.getInstance()
  }
}

export { FetchProjectStatisticsRepo }
