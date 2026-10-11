import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

export class IndexMyInternalAuditApiService extends ServicesInterface {
  private static instance: IndexMyInternalAuditApiService
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new IndexMyInternalAuditApiService())
  }
  async applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.IndexMyInternalAudit,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
