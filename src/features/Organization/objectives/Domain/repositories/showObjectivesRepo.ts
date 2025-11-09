import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowObjectivesApiService } from '../../Data/apiServices/showObjectivesApiService'
import ObjectivesDetailsModel from '../../Data/models/objectivesDetailsModel'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowObjectivesRepo extends RepoInterface<ObjectivesDetailsModel> {
  private static instance: ShowObjectivesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowObjectivesRepo()
    }
    return this.instance
  }

  onParse(data: any): ObjectivesDetailsModel {
    return ObjectivesDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowObjectivesApiService.getInstance()
  }
}

export { ShowObjectivesRepo }
