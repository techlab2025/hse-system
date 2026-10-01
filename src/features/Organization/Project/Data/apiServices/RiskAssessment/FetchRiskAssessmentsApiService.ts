import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchRiskAssessmentsApiService extends ServicesInterface {
  private static instance: FetchRiskAssessmentsApiService
  private constructor() { super() }
  static getInstance(): FetchRiskAssessmentsApiService {
    if (!this.instance) this.instance = new FetchRiskAssessmentsApiService()
    return this.instance
  }
  applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.FetchRiskAssessments,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}
