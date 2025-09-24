import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CertificateDetailsModel from '../../Data/models/CertificateDetailsModel'
import { ShowCertificateApiService } from '../../Data/apiServices/showCertificateApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowCertificateRepo extends RepoInterface<CertificateDetailsModel> {
  private static instance: ShowCertificateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCertificateRepo()
    }
    return this.instance
  }

  onParse(data: any): CertificateDetailsModel {
    return CertificateDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowCertificateApiService.getInstance()
  }
}

export { ShowCertificateRepo }
