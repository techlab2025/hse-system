// import LangModel from '@/features/setting/Service/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import { AddSystemFeatureApiService } from '../../Data/apiServices/addSystemFeatureApiService'

class AddSystemFeatureRepo extends RepoInterface<SystemFeatureModel> {
  private static instance: AddSystemFeatureRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemFeatureRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SystemFeatureModel {
    return SystemFeatureModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSystemFeatureApiService.getInstance()
  }
}

export { AddSystemFeatureRepo }
