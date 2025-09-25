import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HashtagDetailsModel from '../../Data/models/HashtagDetailsModel'
import { ShowHashtagApiService } from '../../Data/apiServices/showHashtagApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowHashtagRepo extends RepoInterface<HashtagDetailsModel> {
  private static instance: ShowHashtagRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHashtagRepo()
    }
    return this.instance
  }

  onParse(data: any): HashtagDetailsModel {
    return HashtagDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHashtagApiService.getInstance()
  }
}

export { ShowHashtagRepo }
