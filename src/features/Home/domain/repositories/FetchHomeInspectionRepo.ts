import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FetchHomeInspectionModel from '../../data/Model/FetchHomeInspectionModel'
import { FetchHomeInspectionApiService } from '../../data/ApiService/FetchHomeInspectionApiService'

class FetchHomeInspectionRepo extends RepoInterface<FetchHomeInspectionModel> {
  private static instance: FetchHomeInspectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchHomeInspectionRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): FetchHomeInspectionModel {
    return FetchHomeInspectionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchHomeInspectionApiService.getInstance()
  }
}

export { FetchHomeInspectionRepo }
