import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexVisitActivityApiService } from '../../Data/apiServices/indexVisitActivityApiService'
import VisitActivityModel from '../../Data/models/VisitActivityModel'

class IndexVisitActivityRepo extends RepoInterface<VisitActivityModel[]> {
  private static instance: IndexVisitActivityRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexVisitActivityRepo()
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): VisitActivityModel[] {
    return data.map((item: any) => VisitActivityModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexVisitActivityApiService.getInstance()
  }
}

export { IndexVisitActivityRepo }
