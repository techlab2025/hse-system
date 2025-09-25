import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PowerFullDetailsModel from '../../Data/models/PowerFullDetailsModel'
import { ShowPowerFullApiService } from '../../Data/apiServices/showPowerFullApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowPowerFullRepo extends RepoInterface<PowerFullDetailsModel> {
  private static instance: ShowPowerFullRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPowerFullRepo()
    }
    return this.instance
  }

  onParse(data: any): PowerFullDetailsModel {
    return PowerFullDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowPowerFullApiService.getInstance()
  }
}

export { ShowPowerFullRepo }
