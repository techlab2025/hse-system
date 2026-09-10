import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowDrillTypeApiService } from '../../Data/apiServices/showDrillTypeApiService'
import DrillTypeDetailsModel from '../../Data/models/DrillTypeDetailsModel'

class ShowDrillTypeRepo extends RepoInterface<DrillTypeDetailsModel> {
  private static instance: ShowDrillTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowDrillTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): DrillTypeDetailsModel {
    return DrillTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowDrillTypeApiService.getInstance()
  }
}

export { ShowDrillTypeRepo }
