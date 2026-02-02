// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexCatalogApiService } from '../../Data/apiServices/indexCatalogApiService'
import TeamModel from '../../Data/models/CatalogModel'

class IndexCatalogRepo extends RepoInterface<TeamModel[]> {
  private static instance: IndexCatalogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCatalogRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TeamModel[] {
    return data.map((item: any) => TeamModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexCatalogApiService.getInstance()
  }
}

export { IndexCatalogRepo }
