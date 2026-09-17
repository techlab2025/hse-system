// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import {  IndexCatalogItemsApiService } from '../../Data/apiServices/indexCatalogItemsApiService'
// import TeamModel from '../../Data/models/CatalogItemsModel'
import CatalogItemsModel from '../../Data/models/CatalogItemsModel'

class IndexCatalogItemsRepo extends RepoInterface<CatalogItemsModel[]> {
  private static instance: IndexCatalogItemsRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCatalogItemsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): CatalogItemsModel[] {
    return data.map((item: any) => CatalogItemsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexCatalogItemsApiService.getInstance()
  }
}

export { IndexCatalogItemsRepo }
