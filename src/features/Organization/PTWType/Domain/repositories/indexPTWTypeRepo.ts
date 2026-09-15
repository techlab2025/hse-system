import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexPTWTypeApiService } from '../../Data/apiServices/indexPTWTypeApiService'
import PTWTypeModel from '../../Data/models/PTWTypeModel'

class IndexPTWTypeRepo extends RepoInterface<PTWTypeModel[]> {
  private static instance: IndexPTWTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPTWTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PTWTypeModel[] {
    return data.map((item: any) => PTWTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexPTWTypeApiService.getInstance()
  }
}

export { IndexPTWTypeRepo }
