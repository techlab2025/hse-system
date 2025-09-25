import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CategoryDetailsModel from '../../Data/models/CategoryDetailsModel'
import { ShowCategoryApiService } from '../../Data/apiServices/showCategoryApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowCategoryRepo extends RepoInterface<CategoryDetailsModel> {
  private static instance: ShowCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCategoryRepo()
    }
    return this.instance
  }

  onParse(data: any): CategoryDetailsModel {
    return CategoryDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowCategoryApiService.getInstance()
  }
}

export { ShowCategoryRepo }
