import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

export default class SaveEmailIntegrationApiService extends ServicesInterface {
  private static instance: SaveEmailIntegrationApiService
  static getInstance() {
    return (this.instance ??= new SaveEmailIntegrationApiService())
  }
  async applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.EmailIntegration,
      type: CrudType.PUT,
      auth: true,
      params,
    })
  }
}
