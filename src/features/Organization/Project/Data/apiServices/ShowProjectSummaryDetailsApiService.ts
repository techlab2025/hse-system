import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class ShowProjectSummaryDetailsApiService extends ServicesInterface {
  private static instance: ShowProjectSummaryDetailsApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectSummaryDetailsApiService()
    }
    return this.instance
  }

  async applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.ShowProjectSummaryDetails,
      type: CrudType.FormData,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}

export { ShowProjectSummaryDetailsApiService }
