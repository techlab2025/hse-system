import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import { DisOrganizationDocumentsApiService } from '../../Data/apiServices/disActiveOrganizationDocumentsApiService'

class DisActiveOrganizationDocumentsRepo extends RepoInterface<OrganizationDocumentsModel> {
  private static instance: DisActiveOrganizationDocumentsRepo

  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveOrganizationDocumentsRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): OrganizationDocumentsModel {
    return OrganizationDocumentsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisOrganizationDocumentsApiService.getInstance()
  }
}

export { DisActiveOrganizationDocumentsRepo }
