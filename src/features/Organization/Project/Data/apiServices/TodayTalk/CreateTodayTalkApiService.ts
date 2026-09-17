import { ApiNames } from '@/base/core/networkStructure/apiNames'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'

export default class CreateTodayTalkApiService extends ServicesInterface {
  private static instance: CreateTodayTalkApiService

  private constructor() {
    super()
  }

  static getInstance(): CreateTodayTalkApiService {
    if (!this.instance) this.instance = new CreateTodayTalkApiService()
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: unknown; statusCode: number }> {
    const isProjectAnswer = 'project_id' in params.toMap()
    return super.call({
      url: isProjectAnswer
        ? ApiNames.instance.CreateTodayTalkAnswer
        : ApiNames.instance.CreateTodayTalk,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}
