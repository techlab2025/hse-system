import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PpeItemModel from '../../Data/models/PpeItemModel'
import { EditPpeItemApiService } from '../../Data/apiServices/editPpeItemApiService'


class EditPpeItemRepo extends RepoInterface<PpeItemModel> {
  private static instance: EditPpeItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditPpeItemRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): PpeItemModel {
    return PpeItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditPpeItemApiService.getInstance()
  }
}

export { EditPpeItemRepo }
