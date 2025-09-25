// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CategoryModel from '../../Data/models/CategoryModel'
import { DisCategoryApiService } from '../../Data/apiServices/disActiveCategoryApiService'

class DisActiveCategoryRepo extends RepoInterface<CategoryModel> {
  private static instance: DisActiveCategoryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveCategoryRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): CategoryModel {
    return CategoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisCategoryApiService.getInstance()
  }
}

export { DisActiveCategoryRepo }
