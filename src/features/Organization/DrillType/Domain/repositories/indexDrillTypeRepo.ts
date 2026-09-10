import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexDrillTypeApiService } from '../../Data/apiServices/indexDrillTypeApiService'
import DrillTypeModel from '../../Data/models/DrillTypeModel'

class IndexDrillTypeRepo extends RepoInterface<DrillTypeModel[]> {
  private static instance: IndexDrillTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexDrillTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): DrillTypeModel[] {
    return data.map((item: any) => DrillTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexDrillTypeApiService.getInstance()
  }
}

export { IndexDrillTypeRepo }
