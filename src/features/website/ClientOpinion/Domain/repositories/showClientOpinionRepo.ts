import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ClientOpinionDetailsModel from '../../Data/models/ClientOpinionDetailsModel'
import { ShowClientOpinionApiService } from '../../Data/apiServices/showClientOpinionApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowClientOpinionRepo extends RepoInterface<ClientOpinionDetailsModel> {
  private static instance: ShowClientOpinionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowClientOpinionRepo()
    }
    return this.instance
  }

  onParse(data: any): ClientOpinionDetailsModel {
    return ClientOpinionDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowClientOpinionApiService.getInstance()
  }
}

export { ShowClientOpinionRepo }
