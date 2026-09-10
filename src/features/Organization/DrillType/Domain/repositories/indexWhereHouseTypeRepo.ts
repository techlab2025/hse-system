import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexWhereHouseTypeApiService } from '../../Data/apiServices/indexWhereHouseTypeApiService'
import WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'

class IndexWhereHouseTypeRepo extends RepoInterface<WhereHouseTypeModel[]> {
  private static instance: IndexWhereHouseTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexWhereHouseTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): WhereHouseTypeModel[] {
    return data.map((item: any) => WhereHouseTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexWhereHouseTypeApiService.getInstance()
  }
}

export { IndexWhereHouseTypeRepo }
