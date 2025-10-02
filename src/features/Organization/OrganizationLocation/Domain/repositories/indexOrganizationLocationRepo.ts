// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import { IndexOrganizationLocationApiService } from '../../Data/apiServices/indexOrganizationLocationApiService'

class IndexOrganizationLocationRepo extends RepoInterface<OrganizationLocationModel[]> {
  private static instance: IndexOrganizationLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationLocationRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): OrganizationLocationModel[] {
    return data.map((item: any) => OrganizationLocationModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexOrganizationLocationApiService.getInstance()
  }
}

export { IndexOrganizationLocationRepo }
