// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MethodsModel from '../../Data/models/MethodModel'
import { IndexMethodsApiService } from '../../Data/apiServices/indexMethodsApiService'

class IndexMethodsRepo extends RepoInterface<MethodsModel[]> {
  private static instance: IndexMethodsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexMethodsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): MethodsModel[] {
    return data.map((item: any) => MethodsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexMethodsApiService.getInstance()
  }
}

export { IndexMethodsRepo }
