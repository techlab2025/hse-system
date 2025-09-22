import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndustryModel from '../../Data/Models/IndustryModel'
import { IndexIndustryApiService } from '../../Data/apiServices/indexIndustryApiService'

class IndexIndustryRepo extends RepoInterface<IndustryModel[]> {
  private static instance: IndexIndustryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexIndustryRepo()
    }
    return this.instance
  }

  onParse(data: any): IndustryModel[] {
    return data.map((item: any) => IndustryModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexIndustryApiService.getInstance()
  }
}

export { IndexIndustryRepo }
