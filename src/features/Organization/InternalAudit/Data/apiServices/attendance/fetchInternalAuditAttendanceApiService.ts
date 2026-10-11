import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchInternalAuditAttendanceApiService extends ServicesInterface {
  private static instance: FetchInternalAuditAttendanceApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchInternalAuditAttendanceApiService()) }

  applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.FetchInternalAuditAttendance,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
