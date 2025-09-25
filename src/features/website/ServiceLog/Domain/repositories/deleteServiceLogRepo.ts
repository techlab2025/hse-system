// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceLogModel from '../../Data/models/ServiceLogModel'
import { DeleteServiceLogApiService } from '../../Data/apiServices/deleteServiceLogApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteServiceLogRepo extends RepoInterface<ServiceLogModel> {
  private static instance: DeleteServiceLogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteServiceLogRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceLogModel {
    return ServiceLogModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteServiceLogApiService.getInstance()
  }
}

export { DeleteServiceLogRepo }
