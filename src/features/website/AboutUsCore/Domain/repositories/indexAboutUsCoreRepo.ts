// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import { IndexAboutUsCoreApiService } from '../../Data/apiServices/indexAboutUsCoreApiService'


class IndexAboutUsCoreRepo extends RepoInterface<AboutUsCoreModel[]> {
  private static instance: IndexAboutUsCoreRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAboutUsCoreRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): AboutUsCoreModel[] {
    return data.map((item: any) => AboutUsCoreModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexAboutUsCoreApiService.getInstance()
  }
}

export { IndexAboutUsCoreRepo }
