// import LangModel from '@/features/setting/PPETool/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PPEToolModel from '../../Data/models/PPEToolModel'
import { AddPPEToolClonesApiService } from '../../Data/apiServices/AddPPEToolClonesApiService'

class AddPPEToolCloneRepo extends RepoInterface<PPEToolModel> {
  private static instance: AddPPEToolCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPPEToolCloneRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PPEToolModel {
    return PPEToolModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddPPEToolClonesApiService.getInstance()
  }
}

export { AddPPEToolCloneRepo }
