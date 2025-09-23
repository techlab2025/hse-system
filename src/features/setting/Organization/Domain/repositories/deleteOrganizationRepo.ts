// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationModel from '../../Data/models/OrganizationModel'
import { DeleteOrganizationApiService } from '../../Data/apiServices/deleteOrganizationApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteOrganizationRepo extends RepoInterface<OrganizationModel> {
  private static instance: DeleteOrganizationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationModel {
    return OrganizationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteOrganizationApiService.getInstance()
  }
}

export { DeleteOrganizationRepo }
