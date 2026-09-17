import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import { ChangeTaskStatusApiService } from '../../../Data/apiServices/employeeTask/ChangeTaskStatusApiService'

class changeTaskStatusRepo extends RepoInterface<IndexOwnTaskModel> {
  private static instance: changeTaskStatusRepo
   
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new changeTaskStatusRepo()
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
    return ChangeTaskStatusApiService.getInstance()
  }
}

export { changeTaskStatusRepo }
