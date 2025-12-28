import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import WhereHouseModel from '../../Data/models/WhereHouseModel'
import { DeleteWhereHouseApiService } from '../../Data/apiServices/deleteWhereHouseApiService'

class DeleteWhereHouseRepo extends RepoInterface<WhereHouseModel> {
  private static instance: DeleteWhereHouseRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteWhereHouseRepo()
    }
    return this.instance
  }

  onParse(data: any): WhereHouseModel {
    return WhereHouseModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteWhereHouseApiService.getInstance()
  }
}

export { DeleteWhereHouseRepo }
