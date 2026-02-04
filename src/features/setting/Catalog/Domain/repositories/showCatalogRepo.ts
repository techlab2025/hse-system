import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import { ShowCatalogApiService } from '../../Data/apiServices/showCatalogApiService'
// import TeamDetailsModel from '../../Data/models/CatalogDetailsModel'
import CatalogDetailsModel from '../../Data/models/CatalogDetailsModel'

class ShowCatalogRepo extends RepoInterface<CatalogDetailsModel> {
  private static instance: ShowCatalogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCatalogRepo()
    }
    return this.instance
  }

  onParse(data: any): CatalogDetailsModel {
    return CatalogDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowCatalogApiService.getInstance()
  }
}

export { ShowCatalogRepo }
