// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { DeleteOrganizationCertificateApiService } from '../../Data/apiServices/deleteOrganizationCertificateApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteOrganizationCertificateRepo extends RepoInterface<OrganizationCertificateModel> {
  private static instance: DeleteOrganizationCertificateRepo

   
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationCertificateRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizationCertificateModel {
    return OrganizationCertificateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteOrganizationCertificateApiService.getInstance()
  }
}

export { DeleteOrganizationCertificateRepo }
