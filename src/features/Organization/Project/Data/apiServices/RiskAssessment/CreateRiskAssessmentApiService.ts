import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class CreateRiskAssessmentApiService extends ServicesInterface {
  private static instance: CreateRiskAssessmentApiService
  private constructor() { super() }
  static getInstance(): CreateRiskAssessmentApiService {
    if (!this.instance) this.instance = new CreateRiskAssessmentApiService()
    return this.instance
  }
  applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.CreateRiskAssessment,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}
