// import LangModel from '@/features/setting/Blog/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import BlogModel from '../../Data/models/BlogModel'
import { AddBlogApiService } from '../../Data/apiServices/addBlogApiService'

class AddBlogRepo extends RepoInterface<BlogModel> {
  private static instance: AddBlogRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddBlogRepo()
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
    return AddBlogApiService.getInstance()
  }
}

export { AddBlogRepo }
