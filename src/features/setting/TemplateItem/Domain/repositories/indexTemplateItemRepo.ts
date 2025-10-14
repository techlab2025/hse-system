// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateItemModel from '../../Data/models/TemplateItemModel'
import { IndexTemplateItemApiService } from '../../Data/apiServices/indexTemplateItemApiService'

class IndexTemplateItemRepo extends RepoInterface<TemplateItemModel[]> {
  private static instance: IndexTemplateItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTemplateItemRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TemplateItemModel[] {
    return data.map((item: any) => TemplateItemModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexTemplateItemApiService.getInstance()
  }
}

export { IndexTemplateItemRepo }
