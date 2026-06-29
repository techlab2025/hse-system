import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexCapaApiService } from '../../Data/apiServices/indexCapaApiService'
import IndexCapaModel from '../../Data/models/IndexCapaModel'

class IndexCapaRepo extends RepoInterface<IndexCapaModel[]> {
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

  onParse(data: any): IndexCapaModel[] {
    console.log(
      data.map((item: any) => IndexCapaModel.fromMap(item)),
      'data.map((item: any) => IndexCapaModel.fromMap(item))',
    )
    return data.map((item: any) => IndexCapaModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexCapaApiService.getInstance()
  }
}

export { IndexCapaRepo }
