// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import LocationModel from '../../Data/models/LocationModel'
import { EditLocationApiService } from '../../Data/apiServices/editLocationApiService'

class EditLocationRepo extends RepoInterface<LocationModel> {
  private static instance: EditLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditLocationRepo()
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
    return EditLocationApiService.getInstance()
  }
}

export { EditLocationRepo }
