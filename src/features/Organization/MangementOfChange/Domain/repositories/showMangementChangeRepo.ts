import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MangementChangeModel from '../../Data/models/MangementChangeModel'
import { ShowMangementChangeApiService } from '../../Data/apiServices/showMangementChangeApiService'

class ShowMangementChangeRepo extends RepoInterface<MangementChangeModel> {
  private static instance: ShowMangementChangeRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowMangementChangeRepo()
    return this.instance
  }

  onParse(data: any): MangementChangeModel {
    return MangementChangeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowMangementChangeApiService.getInstance()
  }
}

export { ShowMangementChangeRepo }
