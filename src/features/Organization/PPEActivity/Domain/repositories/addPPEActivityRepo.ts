// import LangModel from '@/features/setting/PPEActivity/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddPPEActivityApiService } from '../../Data/apiServices/addPPEActivityApiService'
import PPEActivityModel from '../../Data/models/PPEActivityModel'

class AddPPEActivityRepo extends RepoInterface<PPEActivityModel> {
  private static instance: AddPPEActivityRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPPEActivityRepo()
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
    return AddPPEActivityApiService.getInstance()
  }
}

export { AddPPEActivityRepo }
