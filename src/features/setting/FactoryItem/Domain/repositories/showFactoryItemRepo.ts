import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryItemDetailsModel from '@/features/setting/FactoryItem/Data/models/factoryItemDetailsModel.ts'
import { ShowFactoryItemApiService } from '@/features/setting/FactoryItem/Data/apiServices/showFactoryItemApiService.ts'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowFactoryItemRepo extends RepoInterface<FactoryItemDetailsModel> {
  private static instance: ShowFactoryItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowFactoryItemRepo()
    }
    return this.instance
  }

  onParse(data: any): FactoryItemDetailsModel {
    return FactoryItemDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowFactoryItemApiService.getInstance()
  }
}

export { ShowFactoryItemRepo }
