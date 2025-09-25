// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { IndexHomeViewPricingApiService } from '../../Data/apiServices/indexHomeViewPricingApiService'




class IndexHomeViewPricingRepo extends RepoInterface<HomeViewPricingModel[]> {
  private static instance: IndexHomeViewPricingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHomeViewPricingRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HomeViewPricingModel[] {
    return data.map((item: any) => HomeViewPricingModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHomeViewPricingApiService.getInstance()
  }
}

export { IndexHomeViewPricingRepo }
