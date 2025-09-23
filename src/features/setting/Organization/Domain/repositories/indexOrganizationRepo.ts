// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationModel from '../../Data/models/OrganizationModel'
import { IndexOrganizationApiService } from '../../Data/apiServices/indexOrganizationApiService'

class IndexOrganizationRepo extends RepoInterface<OrganizationModel[]> {
  private static instance: IndexOrganizationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): OrganizationModel[] {
    return data.map((item: any) => OrganizationModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexOrganizationApiService.getInstance()
  }
}

export { IndexOrganizationRepo }
