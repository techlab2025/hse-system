import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ShowCapaDetailsModel from '../../Data/models/ShowCapaDetailsModel'
import { ShowCapaDetailsApiService } from '../../Data/apiServices/ShowCapaDetailsApiService'

class ShowCapaDetailsRepo extends RepoInterface<ShowCapaDetailsModel> {
  private static instance: ShowCapaDetailsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCapaDetailsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ShowCapaDetailsModel {
    console.log(data, 'data')
    return ShowCapaDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowCapaDetailsApiService.getInstance()
  }
}

export { ShowCapaDetailsRepo }
