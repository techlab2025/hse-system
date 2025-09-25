// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CertificateModel from '../../Data/models/CertificateModel'
import { DeleteCertificateApiService } from '../../Data/apiServices/deleteCertificateApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteCertificateRepo extends RepoInterface<CertificateModel> {
  private static instance: DeleteCertificateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCertificateRepo()
    }
    return this.instance
  }

  onParse(data: any): CertificateModel {
    return CertificateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteCertificateApiService.getInstance()
  }
}

export { DeleteCertificateRepo }
