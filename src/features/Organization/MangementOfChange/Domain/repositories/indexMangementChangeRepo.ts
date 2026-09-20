import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MangementChangeModel from '../../Data/models/MangementChangeModel'
import { IndexMangementChangeApiService } from '../../Data/apiServices/indexMangementChangeApiService'

class IndexMangementChangeRepo extends RepoInterface<MangementChangeModel[]> {
  private static instance: IndexMangementChangeRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexMangementChangeRepo()
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): MangementChangeModel[] {
    return data.map((item: any) => MangementChangeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexMangementChangeApiService.getInstance()
  }
}

export { IndexMangementChangeRepo }
