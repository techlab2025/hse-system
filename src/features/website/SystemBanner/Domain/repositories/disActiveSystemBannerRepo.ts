// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemBannerModel from '../../Data/models/SystemBannerModel'
import { DisSystemBannerApiService } from '../../Data/apiServices/disSystemBannerApiService'

class DisActiveSystemBannerRepo extends RepoInterface<SystemBannerModel> {
  private static instance: DisActiveSystemBannerRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveSystemBannerRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SystemBannerModel {
    return SystemBannerModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisSystemBannerApiService.getInstance()
  }
}

export { DisActiveSystemBannerRepo }
