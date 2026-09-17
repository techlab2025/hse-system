import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchInvestigationTaskVerificationApiService extends ServicesInterface {
  private static instance: FetchInvestigationTaskVerificationApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchInvestigationTaskVerificationApiService()
    return this.instance
  }

  async applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.FetchInvestigationTaskVerification,
      type: CrudType.POST,
      auth: true,
      params: params,
    })
  }
}
