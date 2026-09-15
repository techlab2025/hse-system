import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowPTWTypeApiService } from '../../Data/apiServices/showPTWTypeApiService'
import PTWTypeDetailsModel from '../../Data/models/PTWTypeDetailsModel'

class ShowPTWTypeRepo extends RepoInterface<PTWTypeDetailsModel> {
  private static instance: ShowPTWTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPTWTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): PTWTypeDetailsModel {
    return PTWTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPTWTypeApiService.getInstance()
  }
}

export { ShowPTWTypeRepo }
