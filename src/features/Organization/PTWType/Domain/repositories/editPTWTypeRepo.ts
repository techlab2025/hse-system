import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PTWTypeModel from '../../Data/models/PTWTypeModel'
import { EditPTWTypeApiService } from '../../Data/apiServices/editPTWTypeApiService'


class EditPTWTypeRepo extends RepoInterface<PTWTypeModel> {
  private static instance: EditPTWTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditPTWTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): PTWTypeModel {
    return PTWTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditPTWTypeApiService.getInstance()
  }
}

export { EditPTWTypeRepo }
