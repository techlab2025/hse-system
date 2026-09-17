import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type Params from '@/base/core/params/params'

class CloneFactoryItemsApiService extends ServicesInterface {
  private static instance: CloneFactoryItemsApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CloneFactoryItemsApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.CloneFactoryItems,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}

export { CloneFactoryItemsApiService }
