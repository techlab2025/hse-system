import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowWhereHouseTypeApiService } from '../../Data/apiServices/showWhereHouseTypeApiService'
import WhereHouseTypeDetailsModel from '../../Data/models/WhereHouseTypeDetailsModel'

class ShowWhereHouseTypeRepo extends RepoInterface<WhereHouseTypeDetailsModel> {
  private static instance: ShowWhereHouseTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowWhereHouseTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): WhereHouseTypeDetailsModel {
    return WhereHouseTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowWhereHouseTypeApiService.getInstance()
  }
}

export { ShowWhereHouseTypeRepo }
