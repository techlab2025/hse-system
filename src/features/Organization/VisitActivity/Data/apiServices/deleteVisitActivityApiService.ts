import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class DeleteVisitActivityApiService extends ServicesInterface {
  private static instance: DeleteVisitActivityApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteVisitActivityApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.DeleteVisitActivity,
      type: CrudType.FormData,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}

export { DeleteVisitActivityApiService }
