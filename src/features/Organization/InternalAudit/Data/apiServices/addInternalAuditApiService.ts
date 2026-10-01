import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

export class AddInternalAuditApiService extends ServicesInterface {
  private static instance: AddInternalAuditApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new AddInternalAuditApiService()) }
  async applyService(params: Params) {
    return super.call({ url: ApiNames.instance.CreateInternalAudit, type: CrudType.POST, auth: true, params, showLoadingDialog: true })
  }
}
