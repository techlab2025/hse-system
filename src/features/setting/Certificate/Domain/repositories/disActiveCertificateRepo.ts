// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CertificateModel from '../../Data/models/CertificateModel'
import { DisCertificateApiService } from '../../Data/apiServices/disActiveCertificateApiService'

class DisActiveCertificateRepo extends RepoInterface<CertificateModel> {
  private static instance: DisActiveCertificateRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveCertificateRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): CertificateModel {
    return CertificateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisCertificateApiService.getInstance()
  }
}

export { DisActiveCertificateRepo }
