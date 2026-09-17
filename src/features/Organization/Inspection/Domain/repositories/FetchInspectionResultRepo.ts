import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchInspectionResultApiService } from '../../Data/apiServices/FetchInspectionResultApiService'
import TaskResultModel from '../../Data/models/FetchTaskResultModels/TasksResultModel'

class FetchInspectionResultRepo extends RepoInterface<TaskResultModel[]> {
  private static instance: FetchInspectionResultRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchInspectionResultRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TaskResultModel[] {
    return data.map((item: any) => TaskResultModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchInspectionResultApiService.getInstance()
  }
}

export { FetchInspectionResultRepo }
