// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { EditHomeViewPricingApiService } from '../../Data/apiServices/editHomeViewPricingApiService'





class EditHomeViewPricingRepo extends RepoInterface<HomeViewPricingModel> {
  private static instance: EditHomeViewPricingRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHomeViewPricingRepo()
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
    return EditHomeViewPricingApiService.getInstance()
  }
}

export { EditHomeViewPricingRepo }
