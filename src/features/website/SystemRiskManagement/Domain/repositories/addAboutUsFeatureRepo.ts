// import LangModel from '@/features/setting/AboutUsFeature/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import { AddAboutUsFeatureApiService } from '../../Data/apiServices/addAboutUsFeatureApiService'


class AddAboutUsFeatureRepo extends RepoInterface<AboutUsFeatureModel> {
  private static instance: AddAboutUsFeatureRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAboutUsFeatureRepo()
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
    return AddAboutUsFeatureApiService.getInstance()
  }
}

export { AddAboutUsFeatureRepo }
