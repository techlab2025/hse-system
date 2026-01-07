import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchTaskResultDetailsApiService } from '../../Data/apiServices/FetchTaskResultDetailsApiService'
import FetchTaskResultDetailsModel from '../../Data/models/FetchTaskResultDetails'

class FetchTaskResultDetailsRepo extends RepoInterface<FetchTaskResultDetailsModel> {
  private static instance: FetchTaskResultDetailsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchTaskResultDetailsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): FetchTaskResultDetailsModel {
    return FetchTaskResultDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchTaskResultDetailsApiService.getInstance()
  }
}

export { FetchTaskResultDetailsRepo }
