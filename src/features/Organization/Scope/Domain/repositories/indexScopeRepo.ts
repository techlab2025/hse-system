import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ScopeModel from '../../Data/models/ScopeModel'
import { IndexScopeApiService } from '../../Data/apiServices/indexScopeApiService'

class IndexScopeRepo extends RepoInterface<ScopeModel[]> {
  private static instance: IndexScopeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexScopeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ScopeModel[] {
    return data.map((item: any) => ScopeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexScopeApiService.getInstance()
  }
}

export { IndexScopeRepo }
