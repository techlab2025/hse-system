// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import { IndexSystemFeatureApiService } from '../../Data/apiServices/indexSystemFeatureApiService'

class IndexSystemFeatureRepo extends RepoInterface<SystemFeatureModel[]> {
  private static instance: IndexSystemFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemFeatureRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SystemFeatureModel[] {
    return data.map((item: any) => SystemFeatureModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSystemFeatureApiService.getInstance()
  }
}

export { IndexSystemFeatureRepo }
