// import LangModel from '@/features/setting/WhereHouseType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddWhereHouseTypeApiService } from '../../Data/apiServices/addWhereHouseTypeApiService'
import WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'

class AddWhereHouseTypeRepo extends RepoInterface<WhereHouseTypeModel> {
  private static instance: AddWhereHouseTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddWhereHouseTypeRepo()
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
    return AddWhereHouseTypeApiService.getInstance()
  }
}

export { AddWhereHouseTypeRepo }
