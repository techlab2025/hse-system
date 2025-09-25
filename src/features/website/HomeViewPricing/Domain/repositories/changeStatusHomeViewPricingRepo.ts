// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { ChangeStatusHomeViewPricingApiService } from '../../Data/apiServices/changeStatusHomeViewPricingApiService'



class ChangeStatusHomeViewPricingRepo extends RepoInterface<HomeViewPricingModel> {
  private static instance: ChangeStatusHomeViewPricingRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusHomeViewPricingRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HomeViewPricingModel {
    return HomeViewPricingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusHomeViewPricingApiService.getInstance()
  }
}

export { ChangeStatusHomeViewPricingRepo }
