import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CreateCapaResultApiService } from '../../Data/apiServices/AddCapaResultApiService'
import CapaModel from '../../Data/models/CapaModel'

class CreateCapaResultRepo extends RepoInterface<CapaModel> {
  private static instance: CreateCapaResultRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateCapaResultRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): CapaModel {
    return CapaModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateCapaResultApiService.getInstance()
  }
}

export { CreateCapaResultRepo }
