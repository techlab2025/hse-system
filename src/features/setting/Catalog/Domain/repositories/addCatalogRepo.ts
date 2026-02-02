// import LangModel from '@/features/setting/TeamType/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddCatalogApiService } from '../../Data/apiServices/addCatalogApiService'
import TeamModel from '../../Data/models/CatalogModel'

class AddCatalogRepo extends RepoInterface<TeamModel> {
  private static instance: AddCatalogRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddCatalogRepo()
    }
    return this.instance
  }

  onParse(data: any): TeamModel {
    return TeamModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddCatalogApiService.getInstance()
  }
}

export { AddCatalogRepo }
