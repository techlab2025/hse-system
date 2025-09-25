// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import { DeleteHomeAboutUsApiService } from '../../Data/apiServices/deleteHomeAboutUsApiService'

// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteHomeAboutUsRepo extends RepoInterface<HomeAboutUsModel> {
  private static instance: DeleteHomeAboutUsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHomeAboutUsRepo()
    }
    return this.instance
  }

  onParse(data: any): HomeAboutUsModel {
    return HomeAboutUsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHomeAboutUsApiService.getInstance()
  }
}

export { DeleteHomeAboutUsRepo }
