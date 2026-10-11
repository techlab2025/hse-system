import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class CreateInternalAuditReportApiService extends ServicesInterface {
  private static instance: CreateInternalAuditReportApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new CreateInternalAuditReportApiService()) }

  applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.CreateInternalAuditReport,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
