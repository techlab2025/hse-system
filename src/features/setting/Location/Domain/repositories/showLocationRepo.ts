import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import LocationDetailsModel from '../../Data/models/LocationDetailsModel'
import { ShowLocationApiService } from '../../Data/apiServices/showLocationApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowLocationRepo extends RepoInterface<LocationDetailsModel> {
  private static instance: ShowLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowLocationRepo()
    }
    return this.instance
  }

  onParse(data: any): LocationDetailsModel {
    return LocationDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowLocationApiService.getInstance()
  }
}

export { ShowLocationRepo }
