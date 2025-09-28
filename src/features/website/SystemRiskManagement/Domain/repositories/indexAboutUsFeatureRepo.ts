// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import { IndexAboutUsFeatureApiService } from '../../Data/apiServices/indexAboutUsFeatureApiService'




class IndexAboutUsFeatureRepo extends RepoInterface<AboutUsFeatureModel[]> {
  private static instance: IndexAboutUsFeatureRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAboutUsFeatureRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): AboutUsFeatureModel[] {
    return data.map((item: any) => AboutUsFeatureModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexAboutUsFeatureApiService.getInstance()
  }
}

export { IndexAboutUsFeatureRepo }
