import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchProjectMeetingsApiService extends ServicesInterface {
  private static instance: FetchProjectMeetingsApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchProjectMeetingsApiService()
    return this.instance
  }

  applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.FetchProjectMeetings,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}
