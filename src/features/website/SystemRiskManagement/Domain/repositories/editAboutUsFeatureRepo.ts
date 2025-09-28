// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import { EditAboutUsFeatureApiService } from '../../Data/apiServices/editAboutUsFeatureApiService'




class EditAboutUsFeatureRepo extends RepoInterface<AboutUsFeatureModel> {
  private static instance: EditAboutUsFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAboutUsFeatureRepo()
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
    return EditAboutUsFeatureApiService.getInstance()
  }
}

export { EditAboutUsFeatureRepo }
