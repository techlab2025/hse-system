import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IndustryModel from '../../Data/Models/IndustryModel'
import { DeleteIndustryApiService } from '../../Data/apiServices/deleteIndustryApiService'

class DeleteIndustryRepo extends RepoInterface<IndustryModel> {
  private static instance: DeleteIndustryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteIndustryRepo()
    }
    return this.instance
  }

  onParse(data: any): IndustryModel {
    return IndustryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteIndustryApiService.getInstance()
  }
}

export { DeleteIndustryRepo }
