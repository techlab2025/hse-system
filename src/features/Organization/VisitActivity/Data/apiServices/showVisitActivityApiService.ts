import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import HeaderHandler from '@/base/core/networkStructure/networking/utils/header_handler'

class ShowVisitActivityApiService extends ServicesInterface {
  private static instance: ShowVisitActivityApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitActivityApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.ShowVisitActivity,
      type: CrudType.FormData,
      auth: true,
      params,
      headers: HeaderHandler.Instance.getHeader(true, false),
    })
  }
}

export { ShowVisitActivityApiService }
