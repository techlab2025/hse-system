import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class ShowMangementChangeApiService extends ServicesInterface {
  private static instance: ShowMangementChangeApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowMangementChangeApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.ShowMangementChange,
      type: CrudType.FormData,
      auth: true,
      params,
    })
  }
}

export { ShowMangementChangeApiService }
