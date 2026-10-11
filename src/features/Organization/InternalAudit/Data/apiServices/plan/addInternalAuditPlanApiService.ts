import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

export class AddInternalAuditPlanApiService extends ServicesInterface {
  private static instance: AddInternalAuditPlanApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new AddInternalAuditPlanApiService()) }
  async applyService(params: Params) {
    return super.call({ url: ApiNames.instance.CreateInternalAuditPlan, type: CrudType.POST, auth: true, params, showLoadingDialog: true })
  }
}
