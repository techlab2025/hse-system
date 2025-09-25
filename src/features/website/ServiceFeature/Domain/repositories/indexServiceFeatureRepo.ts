// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexServiceFeatureApiService } from '../../Data/apiServices/indexServiceFeatureApiService'
import ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'

class IndexServiceFeatureRepo extends RepoInterface<ServiceFeatureModel[]> {
  private static instance: IndexServiceFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceFeatureRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ServiceFeatureModel[] {
    return data.map((item: any) => ServiceFeatureModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexServiceFeatureApiService.getInstance()
  }
}

export { IndexServiceFeatureRepo }
