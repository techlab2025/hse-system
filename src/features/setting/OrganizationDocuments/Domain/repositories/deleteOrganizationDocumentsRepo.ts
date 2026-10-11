import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import { DeleteOrganizationDocumentsApiService } from '../../Data/apiServices/deleteOrganizationDocumentsApiService'

class DeleteOrganizationDocumentsRepo extends RepoInterface<OrganizationDocumentsModel> {
  private static instance: DeleteOrganizationDocumentsRepo

  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationDocumentsRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationDocumentsModel {
    return OrganizationDocumentsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteOrganizationDocumentsApiService.getInstance()
  }
}

export { DeleteOrganizationDocumentsRepo }
