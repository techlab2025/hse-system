// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryModel from '../../Data/models/FactoryModel'
import { IndexFactoryApiService } from '../../Data/apiServices/indexFactoryApiService'

class IndexFactoryRepo extends RepoInterface<FactoryModel[]> {
  private static instance: IndexFactoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexFactoryRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): FactoryModel[] {
    return data.map((item: any) => FactoryModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexFactoryApiService.getInstance()
  }
}

export { IndexFactoryRepo }
