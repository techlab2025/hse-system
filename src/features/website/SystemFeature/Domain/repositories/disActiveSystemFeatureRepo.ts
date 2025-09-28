// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import { DisSystemFeatureApiService } from '../../Data/apiServices/disSystemFeatureApiService'

class DisActiveSystemFeatureRepo extends RepoInterface<SystemFeatureModel> {
  private static instance: DisActiveSystemFeatureRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveSystemFeatureRepo()
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
    return DisSystemFeatureApiService.getInstance()
  }
}

export { DisActiveSystemFeatureRepo }
