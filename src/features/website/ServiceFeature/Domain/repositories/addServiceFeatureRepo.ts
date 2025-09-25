// import LangModel from '@/features/setting/Service/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddServiceFeatureApiService } from '../../Data/apiServices/addServiceFeatureApiService'
import ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'

class AddServiceFeatureRepo extends RepoInterface<ServiceFeatureModel> {
  private static instance: AddServiceFeatureRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddServiceFeatureRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ServiceFeatureModel {
    return ServiceFeatureModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddServiceFeatureApiService.getInstance()
  }
}

export { AddServiceFeatureRepo }
