import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexPPEToolApiService } from '../../Data/apiServices/indexPPEToolApiService'
import PPEToolModel from '../../Data/models/PPEToolModel'

class IndexPPEToolRepo extends RepoInterface<PPEToolModel[]> {
  private static instance: IndexPPEToolRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPPEToolRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PPEToolModel[] {
    return data.map((item: any) => PPEToolModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexPPEToolApiService.getInstance()
  }
}

export { IndexPPEToolRepo }
