import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class ObjectiveProgressDetailsApiService extends ServicesInterface {
  private static instance: ObjectiveProgressDetailsApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ObjectiveProgressDetailsApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.ShowObjectiveProgress,
      type: CrudType.FormData,
      auth: true,
      params,
    })
  }
}

export { ObjectiveProgressDetailsApiService }
