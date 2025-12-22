// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import { IndexFactoryItemApiService } from '@/features/setting/FactoryItem/Data/apiServices/indexFactoryItemApiService.ts'

class IndexFactoryItemRepo extends RepoInterface<FactoryItemModel[]> {
  private static instance: IndexFactoryItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexFactoryItemRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): FactoryItemModel[] {
    return data?.map((item: any) => FactoryItemModel?.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexFactoryItemApiService.getInstance()
  }
}

export { IndexFactoryItemRepo }
