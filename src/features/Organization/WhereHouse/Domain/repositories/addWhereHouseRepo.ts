// import LangModel from '@/features/setting/WhereHouse/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddWhereHouseApiService } from '../../Data/apiServices/addWhereHouseApiService'
import WhereHouseModel from '../../Data/models/WhereHouseModel'

class AddWhereHouseRepo extends RepoInterface<WhereHouseModel> {
  private static instance: AddWhereHouseRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddWhereHouseRepo()
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
    return AddWhereHouseApiService.getInstance()
  }
}

export { AddWhereHouseRepo }
