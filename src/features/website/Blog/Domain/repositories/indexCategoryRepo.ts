// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CategoryModel from '../../Data/models/CategoryModel'
import { IndexCategoryApiService } from '../../Data/apiServices/indexCategoryApiService'

class IndexCategoryRepo extends RepoInterface<CategoryModel[]> {
  private static instance: IndexCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCategoryRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): CategoryModel[] {
    return data.map((item: any) => CategoryModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexCategoryApiService.getInstance()
  }
}

export { IndexCategoryRepo }
