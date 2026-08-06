import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class GetTodayTalkApiService extends ServicesInterface {
  private static instance: GetTodayTalkApiService

  private constructor() {
    super()
  }

  static getInstance(): GetTodayTalkApiService {
    if (!this.instance) this.instance = new GetTodayTalkApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    const response = await super.call({
      url: ApiNames.instance.GetTodayTalk,
      type: CrudType.POST,
      auth: true,
      params,
    })

    const payload = response.data as Record<string, unknown> | unknown[]
    if (
      payload &&
      (Array.isArray(payload) || (!('status' in payload) && !('data' in payload)))
    ) {
      return {
        ...response,
        data: {
          status: true,
          data: payload,
        },
      }
    }

    return response
  }
}
