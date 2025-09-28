import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OurSystemStepDetailsModel from '../../Data/models/OurSystemStepDetailsModel'
import { ShowOurSystemStepApiService } from '../../Data/apiServices/showOurSystemStepApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowOurSystemStepRepo extends RepoInterface<OurSystemStepDetailsModel> {
  private static instance: ShowOurSystemStepRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOurSystemStepRepo()
    }
    return this.instance
  }

  onParse(data: any): OurSystemStepDetailsModel {
    return OurSystemStepDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowOurSystemStepApiService.getInstance()
  }
}

export { ShowOurSystemStepRepo }
