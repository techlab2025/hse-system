import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

export default class EditLeadershipVisitApiService extends ServicesInterface {
  private static instance: EditLeadershipVisitApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditLeadershipVisitApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.EditLeadershipVisit,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}
