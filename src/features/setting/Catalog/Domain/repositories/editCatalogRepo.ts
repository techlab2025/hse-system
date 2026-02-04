// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditCatalogApiService } from '../../Data/apiServices/editCatalogApiService'
// import TeamModel from '../../Data/models/CatalogModel'
import CatalogModel from '../../Data/models/CatalogModel'

class EditCatalogRepo extends RepoInterface<CatalogModel> {
  private static instance: EditCatalogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditCatalogRepo()
    }
    return this.instance
  }

  onParse(data: any): CatalogModel {
    return CatalogModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditCatalogApiService.getInstance()
  }
}

export { EditCatalogRepo }
