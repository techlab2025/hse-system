import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InspectionModel from '../../Data/models/InspectionModel'
import { IndexInspectionApiService } from '../../Data/apiServices/indexInspectiontApiService'

class IndexInspectionRepo extends RepoInterface<InspectionModel[]> {
  private static instance: IndexInspectionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInspectionRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): InspectionModel[] {
    return data.map((item: any) => InspectionModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexInspectionApiService.getInstance()
  }
}

export { IndexInspectionRepo }
