// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import { DeleteCatalogApiService } from '../../Data/apiServices/deleteCatalogApiService'
// import TeamModel from '../../Data/models/CatalogModel'
import CatalogModel from '../../Data/models/CatalogModel'

class DeleteCatalogRepo extends RepoInterface<CatalogModel> {
  private static instance: DeleteCatalogRepo

   
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCatalogRepo()
    }
    return this.instance
  }

  onParse(data: any): CatalogModel {
    return CatalogModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteCatalogApiService.getInstance()
  }
}

export { DeleteCatalogRepo }
