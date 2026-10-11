import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchLeadershipVisitDetailsApiService extends ServicesInterface {
  private static instance: FetchLeadershipVisitDetailsApiService

  private constructor() {
    super()
  }

  static getInstance(): FetchLeadershipVisitDetailsApiService {
    if (!this.instance) this.instance = new FetchLeadershipVisitDetailsApiService()
    return this.instance
  }

  applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.FetchLeadershipVisitDetails,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}
