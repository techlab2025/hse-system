import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MyZonesModel from '../../Data/models/MyZonesModel'
import { FetchMyZonesApiService } from '../../Data/apiServices/fetchMyZonesApiService'

class FetchMyZonesRepo extends RepoInterface<MyZonesModel[]> {
  private static instance: FetchMyZonesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyZonesRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): MyZonesModel[] {
    return data.map((item: any) => MyZonesModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyZonesApiService.getInstance()
  }
}

export { FetchMyZonesRepo }
