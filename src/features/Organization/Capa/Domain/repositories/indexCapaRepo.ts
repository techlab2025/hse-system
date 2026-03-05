import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CapaModel from '../../Data/models/CapaModel'
import { IndexCapaApiService } from '../../Data/apiServices/indexCapaApiService'
import HazardModel from '@/features/Organization/ObservationFactory/Data/models/hazardModel'

class IndexCapaRepo extends RepoInterface<HazardModel[]> {
  private static instance: IndexCapaRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCapaRepo()
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
    return IndexCapaApiService.getInstance()
  }
}

export { IndexCapaRepo }
