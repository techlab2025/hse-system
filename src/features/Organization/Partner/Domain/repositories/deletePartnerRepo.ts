// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PartnerModel from '../../Data/models/PartnerModel'
import { DeletePartnerApiService } from '../../Data/apiServices/deletePartnerApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeletePartnerRepo extends RepoInterface<PartnerModel> {
  private static instance: DeletePartnerRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePartnerRepo()
    }
    return this.instance
  }

  onParse(data: any): PartnerModel {
    return PartnerModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeletePartnerApiService.getInstance()
  }
}

export { DeletePartnerRepo }
