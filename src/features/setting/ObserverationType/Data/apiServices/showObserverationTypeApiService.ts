import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import HeaderHandler from '@/base/core/networkStructure/networking/utils/header_handler.ts'

class ShowObserverationTypeApiService extends ServicesInterface {
  private static instance: ShowObserverationTypeApiService

  private constructor() {
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowObserverationTypeApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.ShowObserverationType,
      type: CrudType.FormData,
      auth: true,
      params: params,
      headers: HeaderHandler.Instance.getHeader(true, false), // Exclude Accept-Language
    })
  }
}

export { ShowObserverationTypeApiService }
