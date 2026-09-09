import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class ProjectHolidaysApiService extends ServicesInterface {
  private static instance: ProjectHolidaysApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ProjectHolidaysApiService()
    return this.instance
  }

  async applyService(params: Params) {
    const isUpdate = (params as { isUpdate?: boolean }).isUpdate === true
    return super.call({
      url: isUpdate ? ApiNames.instance.UpdateProjectHolidays : ApiNames.instance.CreateProjectHolidays,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}

export { ProjectHolidaysApiService }
