// import LangModel from '@/features/setting/PTWType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PTWTypeModel from '../../Data/models/PTWTypeModel'
import { AddPTWTypeClonesApiService } from '../../Data/apiServices/AddPTWTypeClonesApiService'

class AddPTWTypeCloneRepo extends RepoInterface<PTWTypeModel> {
  private static instance: AddPTWTypeCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPTWTypeCloneRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PTWTypeModel {
    return PTWTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddPTWTypeClonesApiService.getInstance()
  }
}

export { AddPTWTypeCloneRepo }
