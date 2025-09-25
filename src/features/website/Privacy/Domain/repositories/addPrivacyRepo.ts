// import LangModel from '@/features/setting/Privacy/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PrivacyModel from '../../Data/models/PrivacyModel'
import { AddPrivacyApiService } from '../../Data/apiServices/addPrivacyApiService'

class AddPrivacyRepo extends RepoInterface<PrivacyModel> {
  private static instance: AddPrivacyRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPrivacyRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PrivacyModel {
    return PrivacyModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddPrivacyApiService.getInstance()
  }
}

export { AddPrivacyRepo }
