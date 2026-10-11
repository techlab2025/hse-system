import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchDrillsApiService extends ServicesInterface {
  private static instance: FetchDrillsApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchDrillsApiService()
    return this.instance
  }

  applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.FetchDrills,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}
