import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncedantModel from '../../Data/models/IncedantModel'
import { IndexIncedantApiService } from '../../Data/apiServices/indexIncedantApiService'

class IndexIncedantRepo extends RepoInterface<IncedantModel[]> {
  private static instance: IndexIncedantRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexIncedantRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): IncedantModel[] {
    return data.map((item: any) => IncedantModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexIncedantApiService.getInstance()
  }
}

export { IndexIncedantRepo }
