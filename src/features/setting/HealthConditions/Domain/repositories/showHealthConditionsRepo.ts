import { ShowHealthConditionsApiService } from '@/features/setting/HealthConditions/Data/apiServices/showHealthConditionsApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import HealthConditionsDetailsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsDetailsModel'

class ShowHealthConditionsRepo extends RepoInterface<HealthConditionsDetailsModel> {
  private static instance: ShowHealthConditionsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHealthConditionsRepo()
    }
    return this.instance
  }

  onParse(data: any): HealthConditionsDetailsModel {
    return HealthConditionsDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHealthConditionsApiService.getInstance()
  }
}

export { ShowHealthConditionsRepo }
