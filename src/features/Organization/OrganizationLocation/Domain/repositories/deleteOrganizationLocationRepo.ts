// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import { DeleteOrganizationLocationApiService } from '../../Data/apiServices/deleteOrganizationLocationApiService'

// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteOrganizationLocationRepo extends RepoInterface<OrganizationLocationModel> {
  private static instance: DeleteOrganizationLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationLocationRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationLocationModel {
    return OrganizationLocationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteOrganizationLocationApiService.getInstance()
  }
}

export { DeleteOrganizationLocationRepo }
