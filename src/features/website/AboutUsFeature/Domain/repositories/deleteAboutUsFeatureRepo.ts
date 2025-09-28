// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import { DeleteAboutUsFeatureApiService } from '../../Data/apiServices/deleteAboutUsFeatureApiService'



// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteAboutUsFeatureRepo extends RepoInterface<AboutUsFeatureModel> {
  private static instance: DeleteAboutUsFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAboutUsFeatureRepo()
    }
    return this.instance
  }

  onParse(data: any): AboutUsFeatureModel {
    return AboutUsFeatureModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteAboutUsFeatureApiService.getInstance()
  }
}

export { DeleteAboutUsFeatureRepo }
