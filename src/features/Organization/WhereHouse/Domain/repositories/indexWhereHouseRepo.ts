import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexWhereHouseApiService } from '../../Data/apiServices/indexWhereHouseApiService'
import WhereHouseModel from '../../Data/models/WhereHouseModel'

class IndexWhereHouseRepo extends RepoInterface<WhereHouseModel[]> {
  private static instance: IndexWhereHouseRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexWhereHouseRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): WhereHouseModel[] {
    return data.map((item: any) => WhereHouseModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexWhereHouseApiService.getInstance()
  }
}

export { IndexWhereHouseRepo }
