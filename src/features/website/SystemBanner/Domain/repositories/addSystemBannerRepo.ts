// import LangModel from '@/features/setting/Service/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddSystemBannerApiService } from '../../Data/apiServices/addSystemBannerApiService'
import SystemBannerModel from '../../Data/models/SystemBannerModel'

class AddSystemBannerRepo extends RepoInterface<SystemBannerModel> {
  private static instance: AddSystemBannerRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemBannerRepo()
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
    return AddSystemBannerApiService.getInstance()
  }
}

export { AddSystemBannerRepo }
