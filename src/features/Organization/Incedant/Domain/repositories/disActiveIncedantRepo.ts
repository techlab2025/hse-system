import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncedantModel from '../../Data/models/IncedantModel'
import { DisIncedantApiService } from '../../Data/apiServices/disIncedantApiService'

class DisActiveIncedantRepo extends RepoInterface<IncedantModel> {
  private static instance: DisActiveIncedantRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveIncedantRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): IncedantModel {
    return IncedantModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisIncedantApiService.getInstance()
  }
}

export { DisActiveIncedantRepo }
