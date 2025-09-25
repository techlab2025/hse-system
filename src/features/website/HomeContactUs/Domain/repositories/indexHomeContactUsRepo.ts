// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import { IndexHomeContactUsApiService } from '../../Data/apiServices/indexHomeContactUsApiService'


class IndexHomeContactUsRepo extends RepoInterface<HomeContactUsModel[]> {
  private static instance: IndexHomeContactUsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHomeContactUsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HomeContactUsModel[] {
    return data.map((item: any) => HomeContactUsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHomeContactUsApiService.getInstance()
  }
}

export { IndexHomeContactUsRepo }
