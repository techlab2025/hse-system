// import LangModel from '@/features/setting/EmployeeCertificate/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type EmployeeCertificateModel from '../../Data/models/EmployeeCertificateModel'
import { AddEmployeeCertificateApiService } from '../../Data/apiServices/addEmployeeCertificateApiService'

class AddEmployeeCertificateRepo extends RepoInterface<EmployeeCertificateModel> {
  private static instance: AddEmployeeCertificateRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddEmployeeCertificateRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): EmployeeCertificateModel {
    return EmployeeCertificateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddEmployeeCertificateApiService.getInstance()
  }
}

export { AddEmployeeCertificateRepo }
