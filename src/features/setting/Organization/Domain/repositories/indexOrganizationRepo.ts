// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AccidentsTypeModel from '../../Data/models/OrganizationModel'
import { IndexAccidentsTypeApiService } from '../../Data/apiServices/indexOrganizationApiService'

class IndexAccidentsTypeRepo extends RepoInterface<AccidentsTypeModel[]> {
  private static instance: IndexAccidentsTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAccidentsTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): AccidentsTypeModel[] {
    return data.map((item: any) => AccidentsTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexAccidentsTypeApiService.getInstance()
  }
}

export { IndexAccidentsTypeRepo }
