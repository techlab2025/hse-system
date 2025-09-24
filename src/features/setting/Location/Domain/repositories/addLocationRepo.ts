// import LangModel from '@/features/setting/Location/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import LocationModel from '../../Data/models/LocationModel'
import { AddLocationApiService } from '../../Data/apiServices/addLocationApiService'

class AddLocationRepo extends RepoInterface<LocationModel> {
  private static instance: AddLocationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddLocationRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): LocationModel {
    return LocationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddLocationApiService.getInstance()
  }
}

export { AddLocationRepo }
