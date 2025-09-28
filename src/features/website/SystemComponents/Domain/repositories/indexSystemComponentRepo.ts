// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemComponentModel from '../../Data/models/SystemComponentModel'
import { IndexSystemComponentApiService } from '../../Data/apiServices/indexSystemComponentApiService'

class IndexSystemComponentRepo extends RepoInterface<SystemComponentModel[]> {
  private static instance: IndexSystemComponentRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemComponentRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SystemComponentModel[] {
    return data.map((item: any) => SystemComponentModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSystemComponentApiService.getInstance()
  }
}

export { IndexSystemComponentRepo }
