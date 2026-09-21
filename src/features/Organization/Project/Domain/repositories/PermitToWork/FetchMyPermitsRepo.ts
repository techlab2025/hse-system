import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectPermitsModel from '../../../Data/models/PermitToWork/ProjectPermitsModel'
import { FetchMyPermitsApiService } from '../../../Data/apiServices/PermitToWork/FetchMyPermitsApiService'

class FetchMyPermitsRepo extends RepoInterface<ProjectPermitsModel[]> {
  private static instance: FetchMyPermitsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyPermitsRepo()
    }
    return this.instance
  }



  onParse(data: any): ProjectPermitsModel[] {
    return data.map((el) => ProjectPermitsModel.fromMap(el))
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyPermitsApiService.getInstance()
  }
}

export { FetchMyPermitsRepo }
