// import LangModel from '@/features/setting/HomeViewPricing/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { AddHomeViewPricingApiService } from '../../Data/apiServices/addHomeViewPricingApiService'

class AddHomeViewPricingRepo extends RepoInterface<HomeViewPricingModel> {
  private static instance: AddHomeViewPricingRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHomeViewPricingRepo()
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
    return AddHomeViewPricingApiService.getInstance()
  }
}

export { AddHomeViewPricingRepo }
