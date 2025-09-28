// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import { ChangeStatusOurSystemStepApiService } from '../../Data/apiServices/changeStatusOurSystemStepApiService'



class ChangeStatusOurSystemStepRepo extends RepoInterface<OurSystemStepModel> {
  private static instance: ChangeStatusOurSystemStepRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusOurSystemStepRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): OurSystemStepModel {
    return OurSystemStepModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusOurSystemStepApiService.getInstance()
  }
}

export { ChangeStatusOurSystemStepRepo }
