// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FaqModel from '../../Data/models/FaqModel'
import { IndexFaqApiService } from '../../Data/apiServices/indexFaqApiService'

class IndexFaqRepo extends RepoInterface<FaqModel[]> {
  private static instance: IndexFaqRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexFaqRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): FaqModel[] {
    return data.map((item: any) => FaqModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexFaqApiService.getInstance()
  }
}

export { IndexFaqRepo }
