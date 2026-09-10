import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import { EditWhereHouseTypeApiService } from '../../Data/apiServices/editWhereHouseTypeApiService'


class EditWhereHouseTypeRepo extends RepoInterface<WhereHouseTypeModel> {
  private static instance: EditWhereHouseTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditWhereHouseTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): WhereHouseTypeModel {
    return WhereHouseTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditWhereHouseTypeApiService.getInstance()
  }
}

export { EditWhereHouseTypeRepo }
