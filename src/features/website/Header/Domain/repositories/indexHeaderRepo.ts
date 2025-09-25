// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HeaderModel from '../../Data/models/HeaderModel'
import { IndexHeaderApiService } from '../../Data/apiServices/indexHeaderApiService'


class IndexHeaderRepo extends RepoInterface<HeaderModel[]> {
  private static instance: IndexHeaderRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHeaderRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HeaderModel[] {
    return data.map((item: any) => HeaderModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHeaderApiService.getInstance()
  }
}

export { IndexHeaderRepo }
