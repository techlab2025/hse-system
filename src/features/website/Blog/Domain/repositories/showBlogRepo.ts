import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import BlogDetailsModel from '../../Data/models/BlogDetailsModel'
import { ShowBlogApiService } from '../../Data/apiServices/showBlogApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowBlogRepo extends RepoInterface<BlogDetailsModel> {
  private static instance: ShowBlogRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowBlogRepo()
    }
    return this.instance
  }

  onParse(data: any): BlogDetailsModel {
    return BlogDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowBlogApiService.getInstance()
  }
}

export { ShowBlogRepo }
