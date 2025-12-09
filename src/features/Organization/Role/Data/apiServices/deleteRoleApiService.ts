import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import type DeleteRoleParams from '../../Core/params/deleteRoleParams'

class DeleteRoleApiService extends ServicesInterface {
  private static instance: DeleteRoleApiService

  private constructor() {
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteRoleApiService()
    }
    return this.instance
  }

  async applyService(params: DeleteRoleParams): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.DeleteRole,
      type: CrudType.POST,
      auth: true,
      params: params,
      showLoadingDialog: true,
    })
  }
}

export { DeleteRoleApiService }
