// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CertificateModel from '../../Data/models/CertificateModel'
import { EditCertificateApiService } from '../../Data/apiServices/editCertificateApiService'

class EditCertificateRepo extends RepoInterface<CertificateModel> {
  private static instance: EditCertificateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditCertificateRepo()
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
    return EditCertificateApiService.getInstance()
  }
}

export { EditCertificateRepo }
