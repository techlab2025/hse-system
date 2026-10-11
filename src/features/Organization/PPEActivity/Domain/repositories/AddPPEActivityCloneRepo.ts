// import LangModel from '@/features/setting/PPEActivity/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PPEActivityModel from '../../Data/models/PPEActivityModel'
import { AddPPEActivityClonesApiService } from '../../Data/apiServices/AddPPEActivityClonesApiService'

class AddPPEActivityCloneRepo extends RepoInterface<PPEActivityModel> {
  private static instance: AddPPEActivityCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPPEActivityCloneRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PPEActivityModel {
    return PPEActivityModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddPPEActivityClonesApiService.getInstance()
  }
}

export { AddPPEActivityCloneRepo }
