// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import {  DeleteCatalogItemsDetailsApiService } from '../../Data/apiServices/deleteCatalogItemsDetailsApiService'
// import TeamModel from '../../Data/models/CatalogItemsModel'
import CatalogItemsModel from '../../Data/models/CatalogItemsModel'

class DeleteCatalogItemsDetailsRepo extends RepoInterface<CatalogItemsModel> {
  private static instance: DeleteCatalogItemsDetailsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCatalogItemsDetailsRepo()
    }
    return this.instance
  }

  onParse(data: any): CatalogItemsModel {
    return CatalogItemsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteCatalogItemsDetailsApiService.getInstance()
  }
}

export { DeleteCatalogItemsDetailsRepo }
