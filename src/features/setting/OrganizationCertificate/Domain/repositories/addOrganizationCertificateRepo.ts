// import LangModel from '@/features/setting/OrganizationCertificate/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { AddOrganizationCertificateApiService } from '../../Data/apiServices/addOrganizationCertificateApiService'

class AddOrganizationCertificateRepo extends RepoInterface<OrganizationCertificateModel> {
  private static instance: AddOrganizationCertificateRepo
   
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddOrganizationCertificateRepo()
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
    return AddOrganizationCertificateApiService.getInstance()
  }
}

export { AddOrganizationCertificateRepo }
