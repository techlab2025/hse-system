// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import { EditHomeContactUsApiService } from '../../Data/apiServices/editHomeContactUsApiService'


class EditHomeContactUsRepo extends RepoInterface<HomeContactUsModel> {
  private static instance: EditHomeContactUsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHomeContactUsRepo()
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
    return EditHomeContactUsApiService.getInstance()
  }
}

export { EditHomeContactUsRepo }
