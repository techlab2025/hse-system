import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class EditNcrsApiService extends ServicesInterface {
  private static instance: EditNcrsApiService
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new EditNcrsApiService()) }

  applyService(params: Params) {
    return super.call({ url: ApiNames.instance.EditInternalAuditNcrs, type: CrudType.POST, auth: true, params })
  }
}
