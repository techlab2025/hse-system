import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndustryModel from '../../Data/Models/IndustryModel'
import { UpdateIndustryApiService } from '../../Data/apiServices/updateIndustryApiService'

class UpdateIndustryRepo extends RepoInterface<IndustryModel> {
  private static instance: UpdateIndustryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateIndustryRepo()
    }
    return this.instance
  }

  onParse(data: any): IndustryModel {
    return IndustryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return UpdateIndustryApiService.getInstance()
  }
}

export { UpdateIndustryRepo }
