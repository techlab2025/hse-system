// import LangModel from '@/features/setting/OrganizationLocation/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import { AddOrganizationLocationApiService } from '../../Data/apiServices/addOrganizationLocationApiService'

class AddOrganizationLocationRepo extends RepoInterface<OrganizationLocationModel> {
  private static instance: AddOrganizationLocationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddOrganizationLocationRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): OrganizationLocationModel {
    return OrganizationLocationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddOrganizationLocationApiService.getInstance()
  }
}

export { AddOrganizationLocationRepo }
