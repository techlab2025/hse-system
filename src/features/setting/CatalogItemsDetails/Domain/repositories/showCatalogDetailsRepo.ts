import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import {  ShowCatalogItemsDetailsApiService } from '../../Data/apiServices/showCatalogItemsDetailsApiService'
// import TeamDetailsModel from '../../Data/models/CatalogItemsDetailsModel'
import CatalogItemsDetailsModel from '../../Data/models/CatalogItemsDetailsModel'

class ShowCatalogItemsDetailsRepo extends RepoInterface<CatalogItemsDetailsModel> {
  private static instance: ShowCatalogItemsDetailsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCatalogItemsDetailsRepo()
    }
    return this.instance
  }

  onParse(data: any): CatalogItemsDetailsModel {
    return CatalogItemsDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowCatalogItemsDetailsApiService.getInstance()
  }
}

export { ShowCatalogItemsDetailsRepo }
