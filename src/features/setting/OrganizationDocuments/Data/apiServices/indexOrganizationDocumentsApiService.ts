import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class IndexOrganizationDocumentsApiService extends ServicesInterface {
  private static instance: IndexOrganizationDocumentsApiService

  private constructor() {
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationDocumentsApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.IndexOrganizationDocuments,
      type: CrudType.POST,
      auth: true,
      params: params,
    })
  }
}

export { IndexOrganizationDocumentsApiService }
