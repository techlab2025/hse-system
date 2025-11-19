import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardModel from '../../Data/models/hazardModel'
import { IndexHazardApiService } from '../../Data/apiServices/indexHazardApiService'

class IndexHazardRepo extends RepoInterface<HazardModel[]> {
  private static instance: IndexHazardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHazardRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HazardModel[] {
    return data.map((item: any) => HazardModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHazardApiService.getInstance()
  }
}

export { IndexHazardRepo }
