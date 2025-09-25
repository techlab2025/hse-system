// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import { IndexHomeAboutUsApiService } from '../../Data/apiServices/indexHomeAboutUsApiService'


class IndexHomeAboutUsRepo extends RepoInterface<HomeAboutUsModel[]> {
  private static instance: IndexHomeAboutUsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHomeAboutUsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HomeAboutUsModel[] {
    return data.map((item: any) => HomeAboutUsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHomeAboutUsApiService.getInstance()
  }
}

export { IndexHomeAboutUsRepo }
