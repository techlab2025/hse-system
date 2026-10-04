import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class ChangeInternalAuditAttendanceStatusApiService extends ServicesInterface {
  private static instance: ChangeInternalAuditAttendanceStatusApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ChangeInternalAuditAttendanceStatusApiService()) }

  applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.ChangeInternalAuditAttendanceStatus,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
