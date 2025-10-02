// import LangModel from '@/features/setting/Partner/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PartnerModel from '../../Data/models/PartnerModel'
import { AddPartnerApiService } from '../../Data/apiServices/addPartnerApiService'

class AddPartnerRepo extends RepoInterface<PartnerModel> {
  private static instance: AddPartnerRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPartnerRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PartnerModel {
    return PartnerModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddPartnerApiService.getInstance()
  }
}

export { AddPartnerRepo }
