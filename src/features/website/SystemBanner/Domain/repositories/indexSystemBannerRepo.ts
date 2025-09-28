// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexSystemBannerApiService } from '../../Data/apiServices/indexSystemBannerApiService'
import SystemBannerModel from '../../Data/models/SystemBannerModel'

class IndexSystemBannerRepo extends RepoInterface<SystemBannerModel[]> {
  private static instance: IndexSystemBannerRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemBannerRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SystemBannerModel[] {
    return data.map((item: any) => SystemBannerModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSystemBannerApiService.getInstance()
  }
}

export { IndexSystemBannerRepo }
