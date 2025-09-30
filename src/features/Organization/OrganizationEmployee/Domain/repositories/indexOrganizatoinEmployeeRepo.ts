// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import { IndexOrganizatoinEmployeeApiService } from '../../Data/apiServices/indexOrganizatoinEmployeeApiService'

class IndexOrganizatoinEmployeeRepo extends RepoInterface<OrganizatoinEmployeeModel[]> {
  private static instance: IndexOrganizatoinEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizatoinEmployeeRepo()
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
    return IndexOrganizatoinEmployeeApiService.getInstance()
  }
}

export { IndexOrganizatoinEmployeeRepo }
