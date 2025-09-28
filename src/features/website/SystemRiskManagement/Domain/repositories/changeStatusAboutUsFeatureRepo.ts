// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import { ChangeStatusAboutUsFeatureApiService } from '../../Data/apiServices/changeStatusAboutUsFeatureApiService'



class ChangeStatusAboutUsFeatureRepo extends RepoInterface<AboutUsFeatureModel> {
  private static instance: ChangeStatusAboutUsFeatureRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusAboutUsFeatureRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): AboutUsFeatureModel {
    return AboutUsFeatureModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusAboutUsFeatureApiService.getInstance()
  }
}

export { ChangeStatusAboutUsFeatureRepo }
