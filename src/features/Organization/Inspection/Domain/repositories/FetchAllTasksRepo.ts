import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InspectionModel from '../../Data/models/InspectionModel'
import { FetchAllTasksApiService } from '../../Data/apiServices/FetchAllTasksApiService'

class FetchAllTasksRepo extends RepoInterface<InspectionModel[]> {
  private static instance: FetchAllTasksRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchAllTasksRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): InspectionModel[] {
    return data.map((item: any) => InspectionModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchAllTasksApiService.getInstance()
  }
}

export { FetchAllTasksRepo }
