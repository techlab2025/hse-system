// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HashtagModel from '../../Data/models/HashtagModel'
import { IndexHashtagApiService } from '../../Data/apiServices/indexHashtagApiService'

class IndexHashtagRepo extends RepoInterface<HashtagModel[]> {
  private static instance: IndexHashtagRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHashtagRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HashtagModel[] {
    return data.map((item: any) => HashtagModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHashtagApiService.getInstance()
  }
}

export { IndexHashtagRepo }
