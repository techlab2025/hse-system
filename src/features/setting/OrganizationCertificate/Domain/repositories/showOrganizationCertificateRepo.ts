import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationCertificateDetailsModel from '../../Data/models/OrganizationCertificateDetailsModel'
import { ShowOrganizationCertificateApiService } from '../../Data/apiServices/showOrganizationCertificateApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowOrganizationCertificateRepo extends RepoInterface<OrganizationCertificateDetailsModel> {
  private static instance: ShowOrganizationCertificateRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationCertificateRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationCertificateDetailsModel {
    return OrganizationCertificateDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowOrganizationCertificateApiService.getInstance()
  }
}

export { ShowOrganizationCertificateRepo }
