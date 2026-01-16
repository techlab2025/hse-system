import { ShowHazardTypeApiService } from '@/features/setting/HazardType/Data/apiServices/showHazardTypeApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import HazardTypeDetailsModel from '@/features/setting/HazardType/Data/models/hazardTypeDetailsModel'

class ShowHazardTypeRepo extends RepoInterface<HazardTypeDetailsModel> {
  private static instance: ShowHazardTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHazardTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): HazardTypeDetailsModel {
    return HazardTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowHazardTypeApiService.getInstance()
  }
}

export { ShowHazardTypeRepo }
