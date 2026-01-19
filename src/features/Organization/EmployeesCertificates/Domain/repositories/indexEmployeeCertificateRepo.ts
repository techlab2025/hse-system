import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import { IndexEmployeeCertificateApiService } from '../../Data/apiServices/indexEmployeeCertificateApiService'

class IndexEmployeeCertificateRepo extends RepoInterface<OrganizatoinEmployeeModel[]> {
  private static instance: IndexEmployeeCertificateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEmployeeCertificateRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): OrganizatoinEmployeeModel[] {
    return data.map((item: any) => OrganizatoinEmployeeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexEmployeeCertificateApiService.getInstance()
  }
}

export { IndexEmployeeCertificateRepo }
