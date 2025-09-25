// import LangModel from '@/features/setting/HomeAboutUs/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import { AddHomeAboutUsApiService } from '../../Data/apiServices/addHomeAboutUsApiService'


class AddHomeAboutUsRepo extends RepoInterface<HomeAboutUsModel> {
  private static instance: AddHomeAboutUsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHomeAboutUsRepo()
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
    return AddHomeAboutUsApiService.getInstance()
  }
}

export { AddHomeAboutUsRepo }
