import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class CreateNcrsApiService extends ServicesInterface {
  private static instance: CreateNcrsApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new CreateNcrsApiService()) }

  applyService(params: Params) {
    return super.call({ url: ApiNames.instance.CreateInternalAuditNcrs, type: CrudType.POST, auth: true, params })
  }
}
