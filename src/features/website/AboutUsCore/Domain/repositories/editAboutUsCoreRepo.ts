// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import { EditAboutUsCoreApiService } from '../../Data/apiServices/editAboutUsCoreApiService'



class EditAboutUsCoreRepo extends RepoInterface<AboutUsCoreModel> {
  private static instance: EditAboutUsCoreRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAboutUsCoreRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): AboutUsCoreModel {
    return AboutUsCoreModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditAboutUsCoreApiService.getInstance()
  }
}

export { EditAboutUsCoreRepo }
