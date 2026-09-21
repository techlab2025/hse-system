import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import { showTaskHistoryApiService } from '../../../Data/apiServices/employeeTask/ShowTaskHistoryApiService'

class showTaskHistoryRepo extends RepoInterface<IndexOwnTaskModel> {
  private static instance: showTaskHistoryRepo
   
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new showTaskHistoryRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): IndexOwnTaskModel {
    return IndexOwnTaskModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return showTaskHistoryApiService.getInstance()
  }
}

export { showTaskHistoryRepo }
