import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MethodsModel from '../../Data/models/MethodModel'
import { AddMethodsApiService } from '../../Data/apiServices/addMethodsApiService'

class AddMethodsRepo extends RepoInterface<MethodsModel> {
  private static instance: AddMethodsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMethodsRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): MethodsModel {
    return MethodsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddMethodsApiService.getInstance()
  }
}

export { AddMethodsRepo }
