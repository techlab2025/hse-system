import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncedantModel from '../../Data/models/IncedantModel'
import { EditIncedantApiService } from '../../Data/apiServices/editIncedantApiService'

class EditIncedantRepo extends RepoInterface<IncedantModel> {
  private static instance: EditIncedantRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditIncedantRepo()
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
    return EditIncedantApiService.getInstance()
  }
}

export { EditIncedantRepo }
