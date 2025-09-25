// import LangModel from '@/features/setting/HomeContactUs/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import { AddHomeContactUsApiService } from '../../Data/apiServices/addHomeContactUsApiService'

class AddHomeContactUsRepo extends RepoInterface<HomeContactUsModel> {
  private static instance: AddHomeContactUsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHomeContactUsRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HomeContactUsModel {
    return HomeContactUsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddHomeContactUsApiService.getInstance()
  }
}

export { AddHomeContactUsRepo }
