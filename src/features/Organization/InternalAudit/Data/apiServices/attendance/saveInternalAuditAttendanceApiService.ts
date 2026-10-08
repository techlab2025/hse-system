import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class SaveInternalAuditAttendanceApiService extends ServicesInterface {
  private static instance: SaveInternalAuditAttendanceApiService
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new SaveInternalAuditAttendanceApiService())
  }

  applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.SaveInternalAuditAttendance,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
