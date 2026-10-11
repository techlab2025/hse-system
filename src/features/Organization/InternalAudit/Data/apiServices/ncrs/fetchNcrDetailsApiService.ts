import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type FetchNcrDetailsParams from '../../../Core/params/ncrs/fetchNcrDetailsParams'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class FetchNcrDetailsApiService extends ServicesInterface {
  private static instance: FetchNcrDetailsApiService
  private constructor() {
    super()
  }

  static getInstance() {
    return (this.instance ??= new FetchNcrDetailsApiService())
  }

  applyService(params: FetchNcrDetailsParams) {
    return super.call({
      url: ApiNames.instance.FetchInternalAuditNcrDetails,
      type: CrudType.POST,
      auth: true,
      params,
    })
  }
}
