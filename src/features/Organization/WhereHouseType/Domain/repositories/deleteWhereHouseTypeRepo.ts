import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import { DeleteWhereHouseTypeApiService } from '../../Data/apiServices/deleteWhereHouseTypeApiService'

class DeleteWhereHouseTypeRepo extends RepoInterface<WhereHouseTypeModel> {
  private static instance: DeleteWhereHouseTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteWhereHouseTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): WhereHouseTypeModel {
    return WhereHouseTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteWhereHouseTypeApiService.getInstance()
  }
}

export { DeleteWhereHouseTypeRepo }
