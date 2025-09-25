// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import { DeleteHomeContactUsApiService } from '../../Data/apiServices/deleteHomeContactUsApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteHomeContactUsRepo extends RepoInterface<HomeContactUsModel> {
  private static instance: DeleteHomeContactUsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHomeContactUsRepo()
    }
    return this.instance
  }

  onParse(data: any): HomeContactUsModel {
    return HomeContactUsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHomeContactUsApiService.getInstance()
  }
}

export { DeleteHomeContactUsRepo }
