// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceLogModel from '../../Data/models/ServiceLogModel'
import { IndexServiceLogApiService } from '../../Data/apiServices/indexServiceLogApiService'

class IndexServiceLogRepo extends RepoInterface<ServiceLogModel[]> {
  private static instance: IndexServiceLogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceLogRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ServiceLogModel[] {
    return data.map((item: any) => ServiceLogModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexServiceLogApiService.getInstance()
  }
}

export { IndexServiceLogRepo }
