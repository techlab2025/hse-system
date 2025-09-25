// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import BlogModel from '../../Data/models/BlogModel'
import { DeleteBlogApiService } from '../../Data/apiServices/deleteBlogApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteBlogRepo extends RepoInterface<BlogModel> {
  private static instance: DeleteBlogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteBlogRepo()
    }
    return this.instance
  }

  onParse(data: any): BlogModel {
    return BlogModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteBlogApiService.getInstance()
  }
}

export { DeleteBlogRepo }
