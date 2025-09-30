import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HerikalyDetailsModel from '../../Data/models/HerikalyDetailsModel'
import { ShowHerikalyApiService } from '../../Data/apiServices/showHerikalyApiService'


// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowHerikalyRepo extends RepoInterface<HerikalyDetailsModel> {
  private static instance: ShowHerikalyRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHerikalyRepo()
    }
    return this.instance
  }

  onParse(data: any): HerikalyDetailsModel {
    return HerikalyDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHerikalyApiService.getInstance()
  }
}

export { ShowHerikalyRepo }
