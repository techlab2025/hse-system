import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class DeleteDrillPlanApiService extends ServicesInterface {
  private static instance: DeleteDrillPlanApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteDrillPlanApiService()
    return this.instance
  }

  applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.DeleteDrillPlan,
      type: CrudType.FormData,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}
