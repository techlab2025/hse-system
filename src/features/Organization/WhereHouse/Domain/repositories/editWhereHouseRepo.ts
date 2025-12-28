import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import WhereHouseModel from '../../Data/models/WhereHouseModel'
import { EditWhereHouseApiService } from '../../Data/apiServices/editWhereHouseApiService'


class EditWhereHouseRepo extends RepoInterface<WhereHouseModel> {
  private static instance: EditWhereHouseRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditWhereHouseRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): WhereHouseModel {
    return WhereHouseModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditWhereHouseApiService.getInstance()
  }
}

export { EditWhereHouseRepo }
