// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import { IndexOrganizationCertificateApiService } from '../../Data/apiServices/indexOrganizationCertificateApiService'

class IndexOrganizationCertificateRepo extends RepoInterface<OrganizationCertificateModel[]> {
  private static instance: IndexOrganizationCertificateRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationCertificateRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): OrganizationCertificateModel[] {
    return data.map((item: any) => OrganizationCertificateModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexOrganizationCertificateApiService.getInstance()
  }
}

export { IndexOrganizationCertificateRepo }
