import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
// import HeaderHandler from '@/base/core/networkStructure/networking/utils/header_handler.ts'

class EditTicketApiService extends ServicesInterface {
  private static instance: EditTicketApiService

  private constructor() {
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTicketApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.EditTicket,
      type: CrudType.POST,
      auth: true,
      params: params,
      showLoadingDialog: true,

    })
  }
}

export { EditTicketApiService }
