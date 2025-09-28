// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import { DeleteAboutUsCoreApiService } from '../../Data/apiServices/deleteAboutUsCoreApiService'


// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteAboutUsCoreRepo extends RepoInterface<AboutUsCoreModel> {
  private static instance: DeleteAboutUsCoreRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAboutUsCoreRepo()
    }
    return this.instance
  }

  onParse(data: any): AboutUsCoreModel {
    return AboutUsCoreModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteAboutUsCoreApiService.getInstance()
  }
}

export { DeleteAboutUsCoreRepo }
