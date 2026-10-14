import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class IndexObjectiveProgressApiService extends ServicesInterface {
  private static instance: IndexObjectiveProgressApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexObjectiveProgressApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.IndexObjectiveProgress,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}

export { IndexObjectiveProgressApiService }
