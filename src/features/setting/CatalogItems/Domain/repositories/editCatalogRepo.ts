// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import {  EditCatalogItemsApiService } from '../../Data/apiServices/editCatalogItemsApiService'
// import TeamModel from '../../Data/models/CatalogItemsModel'
import CatalogItemsModel from '../../Data/models/CatalogItemsModel'

class EditCatalogItemsRepo extends RepoInterface<CatalogItemsModel> {
  private static instance: EditCatalogItemsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditCatalogItemsRepo()
    }
    return this.instance
  }

  onParse(data: any): CatalogItemsModel {
    return CatalogItemsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditCatalogItemsApiService.getInstance()
  }
}

export { EditCatalogItemsRepo }
