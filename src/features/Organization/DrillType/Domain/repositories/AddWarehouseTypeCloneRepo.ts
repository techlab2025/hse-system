// import LangModel from '@/features/setting/WhereHouseType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import { AddWarehouseTypeClonesApiService } from '../../Data/apiServices/AddWarehouseTypeClonesApiService'

class AddWarehouseTypeCloneRepo extends RepoInterface<WhereHouseTypeModel> {
  private static instance: AddWarehouseTypeCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddWarehouseTypeCloneRepo()
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
    return AddWarehouseTypeClonesApiService.getInstance()
  }
}

export { AddWarehouseTypeCloneRepo }
