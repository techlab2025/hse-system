// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditSystemBannerApiService } from '../../Data/apiServices/editSystemBannerApiService'
import SystemBannerModel from '../../Data/models/SystemBannerModel'

class EditSystemBannerRepo extends RepoInterface<SystemBannerModel> {
  private static instance: EditSystemBannerRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditSystemBannerRepo()
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
    return EditSystemBannerApiService.getInstance()
  }
}

export { EditSystemBannerRepo }
