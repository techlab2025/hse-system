// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteSystemBannerApiService } from '../../Data/apiServices/deleteSystemBannerApiService'
import SystemBannerModel from '../../Data/models/SystemBannerModel'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteSystemBannerRepo extends RepoInterface<SystemBannerModel> {
  private static instance: DeleteSystemBannerRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemBannerRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemBannerModel {
    return SystemBannerModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteSystemBannerApiService.getInstance()
  }
}

export { DeleteSystemBannerRepo }
