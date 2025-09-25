// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import BlogModel from '../../Data/models/BlogModel'
import { DisBlogApiService } from '../../Data/apiServices/disActiveBlogApiService'

class DisActiveBlogRepo extends RepoInterface<BlogModel> {
  private static instance: DisActiveBlogRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveBlogRepo()
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
    return DisBlogApiService.getInstance()
  }
}

export { DisActiveBlogRepo }
