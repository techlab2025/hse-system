// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AccidentsTypeModel from '../../Data/models/OrganizationModel'
import { DisAccidentsTypeApiService } from '../../Data/apiServices/disOrganizationApiService'

class DisActiveAccidentsTypeRepo extends RepoInterface<AccidentsTypeModel> {
  private static instance: DisActiveAccidentsTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveAccidentsTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): AccidentsTypeModel {
    return AccidentsTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisAccidentsTypeApiService.getInstance()
  }
}

export { DisActiveAccidentsTypeRepo }
