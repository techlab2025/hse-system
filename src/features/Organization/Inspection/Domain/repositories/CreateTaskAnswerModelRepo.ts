import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CreateTaskResultApiService } from '../../Data/apiServices/CreateTaskResultApiService'
import CreateTaskAmswerModel from '../../Data/models/CreateTaskResultModel'

class CreateTaskAnswerRepo extends RepoInterface<CreateTaskAmswerModel> {
  private static instance: CreateTaskAnswerRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateTaskAnswerRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): CreateTaskAmswerModel {
    return CreateTaskAmswerModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateTaskResultApiService.getInstance()
  }
}

export { CreateTaskAnswerRepo }
