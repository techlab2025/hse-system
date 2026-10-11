// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { EditOrganizationCertificateApiService } from '../../Data/apiServices/editOrganizationCertificateApiService'

class EditOrganizationCertificateRepo extends RepoInterface<OrganizationCertificateModel> {
  private static instance: EditOrganizationCertificateRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditOrganizationCertificateRepo()
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
    return EditOrganizationCertificateApiService.getInstance()
  }
}

export { EditOrganizationCertificateRepo }
