// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { DisOrganizationCertificateApiService } from '../../Data/apiServices/disActiveOrganizationCertificateApiService'

class DisActiveOrganizationCertificateRepo extends RepoInterface<OrganizationCertificateModel> {
  private static instance: DisActiveOrganizationCertificateRepo
   
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveOrganizationCertificateRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): OrganizationCertificateModel {
    return OrganizationCertificateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisOrganizationCertificateApiService.getInstance()
  }
}

export { DisActiveOrganizationCertificateRepo }
