import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndustryModel from '../../Data/Models/IndustryModel'
import { CreateIndustryApiService } from '../../Data/apiServices/create_industry_api_service'

class CreateIndustryRepo extends RepoInterface<IndustryModel> {
  private static instance: CreateIndustryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateIndustryRepo()
    }
    return this.instance
  }

  onParse(data: any): IndustryModel {
    return IndustryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateIndustryApiService.getInstance()
  }
}

export { CreateIndustryRepo }
