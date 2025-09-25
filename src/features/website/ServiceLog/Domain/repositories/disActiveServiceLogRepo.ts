// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceLogModel from '../../Data/models/ServiceLogModel'
import { DisServiceLogApiService } from '../../Data/apiServices/disServiceLogApiService'

class DisActiveServiceLogRepo extends RepoInterface<ServiceLogModel> {
  private static instance: DisActiveServiceLogRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveServiceLogRepo()
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
    return DisServiceLogApiService.getInstance()
  }
}

export { DisActiveServiceLogRepo }
