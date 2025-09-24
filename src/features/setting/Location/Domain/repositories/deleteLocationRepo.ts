// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import LocationModel from '../../Data/models/LocationModel'
import { DeleteLocationApiService } from '../../Data/apiServices/deleteLocationApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteLocationRepo extends RepoInterface<LocationModel> {
  private static instance: DeleteLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteLocationRepo()
    }
    return this.instance
  }

  onParse(data: any): LocationModel {
    return LocationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteLocationApiService.getInstance()
  }
}

export { DeleteLocationRepo }
