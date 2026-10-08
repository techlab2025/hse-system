import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class DeleteTraningTopicApiService extends ServicesInterface {
  private static instance: DeleteTraningTopicApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTraningTopicApiService()
    }
    return this.instance
  }

  async applyService(
    params: Params,
  ): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.delete_traning_topic,
      type: CrudType.FormData,
      auth: true,
      params: params,
    })
  }
}

export { DeleteTraningTopicApiService }
