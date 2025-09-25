// import LangModel from '@/features/setting/Category/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CategoryModel from '../../Data/models/CategoryModel'
import { AddCategoryApiService } from '../../Data/apiServices/addCategoryApiService'

class AddCategoryRepo extends RepoInterface<CategoryModel> {
  private static instance: AddCategoryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddCategoryRepo()
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
    return AddCategoryApiService.getInstance()
  }
}

export { AddCategoryRepo }
