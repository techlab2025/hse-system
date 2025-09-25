import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeViewPricingDetailsModel from '../../Data/models/HomeViewPricingDetailsModel'
import { ShowHomeViewPricingApiService } from '../../Data/apiServices/showHomeViewPricingApiService'



// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowHomeViewPricingRepo extends RepoInterface<HomeViewPricingDetailsModel> {
  private static instance: ShowHomeViewPricingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHomeViewPricingRepo()
    }
    return this.instance
  }

  onParse(data: any): HomeViewPricingDetailsModel {
    return HomeViewPricingDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHomeViewPricingApiService.getInstance()
  }
}

export { ShowHomeViewPricingRepo }
