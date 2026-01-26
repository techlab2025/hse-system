// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexRootCausesApiService } from '@/features/setting/RootCauses/Data/apiServices/indexRootCausesApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RootCausesModel from '../../Data/models/RootCausesModel'

class IndexRootCausesRepo extends RepoInterface<RootCausesModel[]> {
  private static instance: IndexRootCausesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexRootCausesRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): RootCausesModel[] {
    return data.map((item: any) => RootCausesModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexRootCausesApiService.getInstance()
  }
}

export { IndexRootCausesRepo }
