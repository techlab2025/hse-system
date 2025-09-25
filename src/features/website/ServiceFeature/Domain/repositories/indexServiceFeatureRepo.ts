// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceModel from '../../Data/models/ServiceFeatureModel'
import { IndexServiceApiService } from '../../Data/apiServices/indexServiceFeatureApiService'


class IndexServiceRepo extends RepoInterface<ServiceModel[]> {
  private static instance: IndexServiceRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ServiceModel[] {
    return data.map((item: any) => ServiceModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexServiceApiService.getInstance()
  }
}

export { IndexServiceRepo }
