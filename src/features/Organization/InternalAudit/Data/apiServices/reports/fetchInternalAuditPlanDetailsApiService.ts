import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchInternalAuditPlanDetailsApiService extends ServicesInterface {
  private static instance: FetchInternalAuditPlanDetailsApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchInternalAuditPlanDetailsApiService()) }

  applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.FetchInternalAuditPlanDetailsForReport,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
