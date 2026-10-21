import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import { NotFoundException } from '@/base/core/Constance/exception_constants'

export default class FetchEmailIntegrationApiService extends ServicesInterface {
  private static instance: FetchEmailIntegrationApiService
  static getInstance() {
    return (this.instance ??= new FetchEmailIntegrationApiService())
  }
  async applyService(params: Params) {
    const response = await super
      .call({
        url: ApiNames.instance.EmailIntegration,
        type: CrudType.GET,
        auth: true,
        params,
      })
      .catch((error: unknown) => {
        // No saved configuration (or an endpoint awaiting backend delivery): allow
        // manual setup. Saving still uses the real API and reports its errors.
        if (error instanceof NotFoundException) {
          return { statusCode: 200, data: { status: true, data: { can_manage: true } } }
        }
        throw error
      })
    const data = response.data?.data
    const empty =
      data == null ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === 'object' && Object.keys(data).length === 0)

    // A successful empty fetch is the first-time setup state, not a load error.
    // Preserve an explicit server denial even when no configuration exists yet.
    if (response.statusCode === 200 && response.data?.status && empty) {
      response.data = {
        ...response.data,
        data: { can_manage: response.data.can_manage !== false },
      }
    }
    return response
  }
}
