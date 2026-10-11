import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import HeaderHandler from '@/base/core/networkStructure/networking/utils/header_handler'

class ShowVisitCategoryApiService extends ServicesInterface {
  private static instance: ShowVisitCategoryApiService
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitCategoryApiService()
    return this.instance
  }
  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.instance.ShowVisitCategory,
      type: CrudType.FormData,
      auth: true,
      params,
      headers: HeaderHandler.Instance.getHeader(true, false),
    })
  }
}
export { ShowVisitCategoryApiService }
