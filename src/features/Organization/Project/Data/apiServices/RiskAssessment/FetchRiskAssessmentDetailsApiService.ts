import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchRiskAssessmentDetailsApiService extends ServicesInterface {
  private static instance: FetchRiskAssessmentDetailsApiService
  private constructor() { super() }
  static getInstance(): FetchRiskAssessmentDetailsApiService {
    if (!this.instance) this.instance = new FetchRiskAssessmentDetailsApiService()
    return this.instance
  }
  applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.FetchRiskAssessmentDetails,
      type: CrudType.FormData,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}
