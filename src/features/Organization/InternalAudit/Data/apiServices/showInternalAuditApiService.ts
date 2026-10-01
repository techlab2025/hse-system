import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

export class ShowInternalAuditApiService extends ServicesInterface {
  private static instance: ShowInternalAuditApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ShowInternalAuditApiService()) }
  async applyService(params: Params) {
    return super.call({ url: ApiNames.instance.ShowInternalAudit, type: CrudType.POST, auth: true, params })
  }
}
