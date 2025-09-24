// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CertificateModel from '../../Data/models/CertificateModel'
import { IndexCertificateApiService } from '../../Data/apiServices/indexCertificateApiService'

class IndexCertificateRepo extends RepoInterface<CertificateModel[]> {
  private static instance: IndexCertificateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCertificateRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): CertificateModel[] {
    return data.map((item: any) => CertificateModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexCertificateApiService.getInstance()
  }
}

export { IndexCertificateRepo }
