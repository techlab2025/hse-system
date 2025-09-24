// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateModel from '../../Data/models/TemplateModel'
import { IndexTemplateApiService } from '../../Data/apiServices/indexTemplateApiService'

class IndexTemplateRepo extends RepoInterface<TemplateModel[]> {
  private static instance: IndexTemplateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTemplateRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TemplateModel[] {
    return data.map((item: any) => TemplateModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexTemplateApiService.getInstance()
  }
}

export { IndexTemplateRepo }
