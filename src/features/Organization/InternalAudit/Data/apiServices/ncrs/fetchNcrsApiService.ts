import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchNcrsApiService extends ServicesInterface {
  private static instance: FetchNcrsApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchNcrsApiService()) }

  applyService(params: Params) {
    return super.call({ url: ApiNames.instance.FetchInternalAuditNcrs, type: CrudType.POST, auth: true, params })
  }
}
