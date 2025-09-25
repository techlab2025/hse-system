// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import { ChangeStatusHomeAboutUsApiService } from '../../Data/apiServices/changeStatusTemplateApiService'


class ChangeStatusHomeAboutUsRepo extends RepoInterface<HomeAboutUsModel> {
  private static instance: ChangeStatusHomeAboutUsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusHomeAboutUsRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HomeAboutUsModel {
    return HomeAboutUsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusHomeAboutUsApiService.getInstance()
  }
}

export { ChangeStatusHomeAboutUsRepo }
