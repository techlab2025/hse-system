import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexPPEActivityApiService } from '../../Data/apiServices/indexPPEActivityApiService'
import PPEActivityModel from '../../Data/models/PPEActivityModel'

class IndexPPEActivityRepo extends RepoInterface<PPEActivityModel[]> {
  private static instance: IndexPPEActivityRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPPEActivityRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PPEActivityModel[] {
    return data.map((item: any) => PPEActivityModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexPPEActivityApiService.getInstance()
  }
}

export { IndexPPEActivityRepo }
