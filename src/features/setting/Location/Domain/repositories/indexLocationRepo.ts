// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import LocationModel from '../../Data/models/LocationModel'
import { IndexLocationApiService } from '../../Data/apiServices/indexLocationApiService'

class IndexLocationRepo extends RepoInterface<LocationModel[]> {
  private static instance: IndexLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexLocationRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): LocationModel[] {
    return data.map((item: any) => LocationModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexLocationApiService.getInstance()
  }
}

export { IndexLocationRepo }
