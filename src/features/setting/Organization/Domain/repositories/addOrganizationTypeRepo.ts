// import LangModel from '@/features/setting/Organization/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationModel from '../../Data/models/OrganizationModel'
import { AddOrganizationApiService } from '../../Data/apiServices/addOrganizationApiService'

class AddOrganizationRepo extends RepoInterface<OrganizationModel> {
  private static instance: AddOrganizationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddOrganizationRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): OrganizationModel {
    return OrganizationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddOrganizationApiService.getInstance()
  }
}

export { AddOrganizationRepo }
