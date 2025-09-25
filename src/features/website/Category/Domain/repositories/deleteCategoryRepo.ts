// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CategoryModel from '../../Data/models/CategoryModel'
import { DeleteCategoryApiService } from '../../Data/apiServices/deleteCategoryApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteCategoryRepo extends RepoInterface<CategoryModel> {
  private static instance: DeleteCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCategoryRepo()
    }
    return this.instance
  }

  onParse(data: any): CategoryModel {
    return CategoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteCategoryApiService.getInstance()
  }
}

export { DeleteCategoryRepo }
