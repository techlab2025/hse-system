// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import { IndexClientOpinionApiService } from '../../Data/apiServices/indexClientOpinionApiService'

class IndexClientOpinionRepo extends RepoInterface<ClientOpinionModel[]> {
  private static instance: IndexClientOpinionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexClientOpinionRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ClientOpinionModel[] {
    return data.map((item: any) => ClientOpinionModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexClientOpinionApiService.getInstance()
  }
}

export { IndexClientOpinionRepo }
