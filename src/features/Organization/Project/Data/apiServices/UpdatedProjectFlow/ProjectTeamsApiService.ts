import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class ProjectTeamsApiService extends ServicesInterface {
  private static instance: ProjectTeamsApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ProjectTeamsApiService()
    return this.instance
  }

  async applyService(params: Params) {
    const isUpdate = (params as { isUpdate?: boolean }).isUpdate === true
    return super.call({
      url: isUpdate ? ApiNames.instance.UpdateProjectTeams : ApiNames.instance.CreateProjectTeams,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}

export { ProjectTeamsApiService }
