// import LangModel from '@/features/setting/TeamType/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddCatalogItemsApiService } from '../../Data/apiServices/addCatalogItemsApiService'
// import TeamModel from '../../Data/models/CatalogItemsModel'
import CatalogItemsModel from '../../Data/models/CatalogItemsModel'

class AddCatalogItemsRepo extends RepoInterface<CatalogItemsModel> {
  private static instance: AddCatalogItemsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddCatalogItemsRepo() 
    }
    return this.instance
  }

  onParse(data: any): CatalogItemsModel {
    return CatalogItemsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddCatalogItemsApiService.getInstance()
  }
}

export { AddCatalogItemsRepo }
