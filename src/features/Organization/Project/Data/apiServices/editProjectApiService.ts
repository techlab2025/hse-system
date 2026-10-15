import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import { invalidateProjectListCacheAfter } from '../cache/projectListCache'
// import HeaderHandler from '@/base/core/networkStructure/networking/utils/header_handler.ts'

class EditProjectApiService extends ServicesInterface {
  private static instance: EditProjectApiService

  private constructor() {
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditProjectApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    return invalidateProjectListCacheAfter(
      super.call({
        url: ApiNames.instance.EditProject,
        type: CrudType.POST,
        auth: true,
        params: params,
        showLoadingDialog: true,
      }),
    )
  }
}

export { EditProjectApiService }
