import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

export default class FetchSystemIdentityApiService extends ServicesInterface {
  private static instance: FetchSystemIdentityApiService
  static getInstance() {
    return (this.instance ??= new FetchSystemIdentityApiService())
  }
  applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.FetchSystemIdentity,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
