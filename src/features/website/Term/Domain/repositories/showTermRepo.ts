import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TermDetailsModel from '../../Data/models/TermDetailsModel'
import { ShowTermApiService } from '../../Data/apiServices/showTermApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowTermRepo extends RepoInterface<TermDetailsModel> {
  private static instance: ShowTermRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTermRepo()
    }
    return this.instance
  }

  onParse(data: any): TermDetailsModel {
    return TermDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowTermApiService.getInstance()
  }
}

export { ShowTermRepo }
