import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationDocumentsDetailsModel from '../../Data/models/OrganizationDocumentsDetailsModel'
import { ShowOrganizationDocumentsApiService } from '../../Data/apiServices/showOrganizationDocumentsApiService'

class ShowOrganizationDocumentsRepo extends RepoInterface<OrganizationDocumentsDetailsModel> {
  private static instance: ShowOrganizationDocumentsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationDocumentsRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationDocumentsDetailsModel {
    return OrganizationDocumentsDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowOrganizationDocumentsApiService.getInstance()
  }
}

export { ShowOrganizationDocumentsRepo }
