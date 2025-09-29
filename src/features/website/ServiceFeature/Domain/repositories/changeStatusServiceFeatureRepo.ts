// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'
import { ChangeStatusServiceFeatureApiService } from '../../Data/apiServices/changeStatusServiceFeatureApiService'



class ChangeStatusServiceFeatureRepo extends RepoInterface<ServiceFeatureModel> {
  private static instance: ChangeStatusServiceFeatureRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusServiceFeatureRepo()
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
    return ChangeStatusServiceFeatureApiService.getInstance()
  }
}

export { ChangeStatusServiceFeatureRepo }
