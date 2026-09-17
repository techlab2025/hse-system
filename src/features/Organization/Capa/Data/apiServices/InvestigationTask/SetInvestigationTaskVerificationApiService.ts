import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class SetInvestigationTaskVerificationApiService extends ServicesInterface {
  private static instance: SetInvestigationTaskVerificationApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new SetInvestigationTaskVerificationApiService()
    return this.instance
  }

  async applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.SetInvestigationTaskVerification,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
