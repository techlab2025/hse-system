import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowWhereHouseApiService } from '../../Data/apiServices/showWhereHouseApiService'
import WhereHouseDetailsModel from '../../Data/models/WhereHouseDetailsModel'

class ShowWhereHouseRepo extends RepoInterface<WhereHouseDetailsModel> {
  private static instance: ShowWhereHouseRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowWhereHouseRepo()
    }
    return this.instance
  }

  onParse(data: any): WhereHouseDetailsModel {
    return WhereHouseDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowWhereHouseApiService.getInstance()
  }
}

export { ShowWhereHouseRepo }
