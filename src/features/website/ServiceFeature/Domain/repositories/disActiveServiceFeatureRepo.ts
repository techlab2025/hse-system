// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceModel from '../../Data/models/ServiceFeatureModel'
import { DisServiceApiService } from '../../Data/apiServices/disServiceFeatureApiService'


class DisActiveServiceRepo extends RepoInterface<ServiceModel> {
  private static instance: DisActiveServiceRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveServiceRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ServiceModel {
    return ServiceModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisServiceApiService.getInstance()
  }
}

export { DisActiveServiceRepo }
