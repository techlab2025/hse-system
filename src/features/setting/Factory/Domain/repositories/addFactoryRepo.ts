// import LangModel from '@/features/setting/Factory/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryModel from '../../Data/models/FactoryModel'
import { AddFactoryApiService } from '../../Data/apiServices/addFactoryApiService'

class AddFactoryRepo extends RepoInterface<FactoryModel> {
  private static instance: AddFactoryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddFactoryRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): FactoryModel {
    return FactoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddFactoryApiService.getInstance()
  }
}

export { AddFactoryRepo }
