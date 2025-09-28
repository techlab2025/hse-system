// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import BlogModel from '../../Data/models/BlogModel'
import { EditBlogApiService } from '../../Data/apiServices/editBlogApiService'

class EditBlogRepo extends RepoInterface<BlogModel> {
  private static instance: EditBlogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditBlogRepo()
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
    return EditBlogApiService.getInstance()
  }
}

export { EditBlogRepo }
