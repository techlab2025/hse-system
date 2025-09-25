// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import BlogModel from '../../Data/models/BlogModel'
import { IndexBlogApiService } from '../../Data/apiServices/indexBlogApiService'

class IndexBlogRepo extends RepoInterface<BlogModel[]> {
  private static instance: IndexBlogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexBlogRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): BlogModel[] {
    return data.map((item: any) => BlogModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexBlogApiService.getInstance()
  }
}

export { IndexBlogRepo }
