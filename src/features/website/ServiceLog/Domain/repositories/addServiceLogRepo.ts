// import LangModel from '@/features/setting/Service/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type ServiceLogDetailsModel from '../../Data/models/ServiceDetailsLogModel'
import ServiceLogModel from '../../Data/models/ServiceLogModel'
import { AddServiceLogApiService } from '../../Data/apiServices/addServiceLogApiService'

class AddServiceLogRepo extends RepoInterface<ServiceLogModel> {
  private static instance: AddServiceLogRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddServiceLogRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ServiceLogModel {
    return ServiceLogModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddServiceLogApiService.getInstance()
  }
}

export { AddServiceLogRepo }
