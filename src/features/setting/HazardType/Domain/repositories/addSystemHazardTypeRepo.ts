import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import { AddSystemHazardTypeApiService } from '../../Data/apiServices/addSystemHazardTypeApiService'

class AddSystemHazardTypeRepo extends RepoInterface<HazardTypeModel> {
  private static instance: AddSystemHazardTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemHazardTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HazardTypeModel {
    return HazardTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSystemHazardTypeApiService.getInstance()
  }
}

export { AddSystemHazardTypeRepo }
