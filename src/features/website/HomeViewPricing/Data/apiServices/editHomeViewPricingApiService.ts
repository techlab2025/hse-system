import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
// import HomeViewPricingHandler from '@/base/core/networkStructure/networking/utils/HomeViewPricing_handler.ts'

class EditHomeViewPricingApiService extends ServicesInterface {
  private static instance: EditHomeViewPricingApiService

  private constructor() {
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHomeViewPricingApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.EditHomeViewPricing,
      type: CrudType.POST,
      auth: true,
      params: params,
      showLoadingDialog: true,

    })
  }
}

export { EditHomeViewPricingApiService }
