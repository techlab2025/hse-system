// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import { DisServiceSectionApiService } from '../../Data/apiServices/disServiceSectionApiService'

class DisActiveServiceSectionRepo extends RepoInterface<ServiceSectionModel> {
  private static instance: DisActiveServiceSectionRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveServiceSectionRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ServiceSectionModel {
    return ServiceSectionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisServiceSectionApiService.getInstance()
  }
}

export { DisActiveServiceSectionRepo }
