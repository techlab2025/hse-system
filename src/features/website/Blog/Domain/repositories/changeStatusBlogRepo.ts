// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import BlogModel from '../../Data/models/BlogModel'
import { ChangeStatusBlogApiService } from '../../Data/apiServices/changeStatusBlogApiService'



class ChangeStatusBlogRepo extends RepoInterface<BlogModel> {
  private static instance: ChangeStatusBlogRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusBlogRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): BlogModel {
    return BlogModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeStatusBlogApiService.getInstance()
  }
}

export { ChangeStatusBlogRepo }
