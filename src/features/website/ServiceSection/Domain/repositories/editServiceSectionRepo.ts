// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import { EditServiceSectionApiService } from '../../Data/apiServices/editServiceSectionApiService'

class EditServiceSectionRepo extends RepoInterface<ServiceSectionModel> {
  private static instance: EditServiceSectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditServiceSectionRepo()
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
    return EditServiceSectionApiService.getInstance()
  }
}

export { EditServiceSectionRepo }
