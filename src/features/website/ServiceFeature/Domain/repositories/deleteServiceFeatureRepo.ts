// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteServiceFeatureApiService } from '../../Data/apiServices/deleteServiceFeatureApiService'
import ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteServiceFeatureRepo extends RepoInterface<ServiceFeatureModel> {
  private static instance: DeleteServiceFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteServiceFeatureRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceFeatureModel {
    return ServiceFeatureModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteServiceFeatureApiService.getInstance()
  }
}

export { DeleteServiceFeatureRepo }
