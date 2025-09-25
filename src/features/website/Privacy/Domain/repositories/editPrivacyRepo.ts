// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PrivacyModel from '../../Data/models/PrivacyModel'
import { EditPrivacyApiService } from '../../Data/apiServices/editPrivacyApiService'

class EditPrivacyRepo extends RepoInterface<PrivacyModel> {
  private static instance: EditPrivacyRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditPrivacyRepo()
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
    return EditPrivacyApiService.getInstance()
  }
}

export { EditPrivacyRepo }
