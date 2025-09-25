// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemWorkModel from '../../Data/models/SystemWorkModel'
import { IndexSystemWorkApiService } from '../../Data/apiServices/indexSystemWorkApiService'



class IndexSystemWorkRepo extends RepoInterface<SystemWorkModel[]> {
  private static instance: IndexSystemWorkRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemWorkRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SystemWorkModel[] {
    return data.map((item: any) => SystemWorkModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSystemWorkApiService.getInstance()
  }
}

export { IndexSystemWorkRepo }
