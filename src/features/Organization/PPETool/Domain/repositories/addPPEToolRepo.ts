// import LangModel from '@/features/setting/PPETool/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddPPEToolApiService } from '../../Data/apiServices/addPPEToolApiService'
import PPEToolModel from '../../Data/models/PPEToolModel'

class AddPPEToolRepo extends RepoInterface<PPEToolModel> {
  private static instance: AddPPEToolRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPPEToolRepo()
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
    return AddPPEToolApiService.getInstance()
  }
}

export { AddPPEToolRepo }
