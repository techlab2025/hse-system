// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { DeleteHomeViewPricingApiService } from '../../Data/apiServices/deleteHomeViewPricingApiService'




// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteHomeViewPricingRepo extends RepoInterface<HomeViewPricingModel> {
  private static instance: DeleteHomeViewPricingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHomeViewPricingRepo()
    }
    return this.instance
  }

  onParse(data: any): HomeViewPricingModel {
    return HomeViewPricingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHomeViewPricingApiService.getInstance()
  }
}

export { DeleteHomeViewPricingRepo }
