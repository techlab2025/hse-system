import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import HeaderHandler from '@/base/core/networkStructure/networking/utils/header_handler.ts'
import type ShowTicketParams from '../../Core/params/showTicketParams'

class ShowTicketApiService extends ServicesInterface {
  private static instance: ShowTicketApiService

  private constructor() {
    super() // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTicketApiService()
    }
    return this.instance
  }

  async applyService(params: ShowTicketParams): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.ShowTicket,
      type: CrudType.FormData,
      auth: true,
      params: params,
      headers: HeaderHandler.Instance.getHeader(true, params?.isLang ? true : false), // Exclude Accept-Language
    })
  }
}

export { ShowTicketApiService }
