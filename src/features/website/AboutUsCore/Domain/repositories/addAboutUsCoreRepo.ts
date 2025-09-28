// import LangModel from '@/features/setting/AboutUsCore/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import { AddAboutUsCoreApiService } from '../../Data/apiServices/addAboutUsCoreApiService'




class AddAboutUsCoreRepo extends RepoInterface<AboutUsCoreModel> {
  private static instance: AddAboutUsCoreRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAboutUsCoreRepo()
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
    return AddAboutUsCoreApiService.getInstance()
  }
}

export { AddAboutUsCoreRepo }
