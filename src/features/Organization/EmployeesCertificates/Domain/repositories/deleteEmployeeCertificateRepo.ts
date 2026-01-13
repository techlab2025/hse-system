import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import  EmployeeCertificateModel from '../../Data/models/EmployeeCertificateModel'
import { DeleteEmployeeCertificateApiService } from '../../Data/apiServices/deleteEmployeeCertificateApiService'

class DeleteEmployeeCertificateRepo extends RepoInterface<EmployeeCertificateModel> {
  private static instance: DeleteEmployeeCertificateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEmployeeCertificateRepo()
    }
    return this.instance
  }

  onParse(data: any): EmployeeCertificateModel {
    return EmployeeCertificateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteEmployeeCertificateApiService.getInstance()
  }
}

export { DeleteEmployeeCertificateRepo }
