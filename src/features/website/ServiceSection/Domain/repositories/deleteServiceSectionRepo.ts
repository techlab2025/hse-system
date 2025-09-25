// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import { DeleteServiceSectionApiService } from '../../Data/apiServices/deleteServiceSectionApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteServiceSectionRepo extends RepoInterface<ServiceSectionModel> {
  private static instance: DeleteServiceSectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteServiceSectionRepo()
    }
    return this.instance
  }

  onParse(data: any): ServiceSectionModel {
    return ServiceSectionModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteServiceSectionApiService.getInstance()
  }
}

export { DeleteServiceSectionRepo }
