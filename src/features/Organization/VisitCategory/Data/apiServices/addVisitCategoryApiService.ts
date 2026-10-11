import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class AddVisitCategoryApiService extends ServicesInterface {
  private static instance: AddVisitCategoryApiService
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new AddVisitCategoryApiService()
    return this.instance
  }
  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.CreateVisitCategory,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}
export { AddVisitCategoryApiService }
