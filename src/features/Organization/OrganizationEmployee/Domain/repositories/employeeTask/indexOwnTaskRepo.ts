import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import { indexOwnTaskApiService } from '../../../Data/apiServices/employeeTask/indexOwnTaskApiService'

class indexOwnTaskRepo extends RepoInterface<IndexOwnTaskModel> {
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

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): IndexOwnTaskModel {
    return IndexOwnTaskModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return indexOwnTaskApiService.getInstance()
  }
}

export { indexOwnTaskRepo }
