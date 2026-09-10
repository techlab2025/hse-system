import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexPpeItemApiService } from '../../Data/apiServices/indexPpeItemApiService'
import PpeItemModel from '../../Data/models/PpeItemModel'

class IndexPpeItemRepo extends RepoInterface<PpeItemModel[]> {
  private static instance: IndexPpeItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPpeItemRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PpeItemModel[] {
    return data.map((item: any) => PpeItemModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexPpeItemApiService.getInstance()
  }
}

export { IndexPpeItemRepo }
