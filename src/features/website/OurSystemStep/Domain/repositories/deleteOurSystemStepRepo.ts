// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import { DeleteOurSystemStepApiService } from '../../Data/apiServices/deleteOurSystemStepApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteOurSystemStepRepo extends RepoInterface<OurSystemStepModel> {
  private static instance: DeleteOurSystemStepRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOurSystemStepRepo()
    }
    return this.instance
  }

  onParse(data: any): OurSystemStepModel {
    return OurSystemStepModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteOurSystemStepApiService.getInstance()
  }
}

export { DeleteOurSystemStepRepo }
