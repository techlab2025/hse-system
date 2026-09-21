import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PPEToolModel from '../../Data/models/PPEToolModel'
import { EditPPEToolApiService } from '../../Data/apiServices/editPPEToolApiService'


class EditPPEToolRepo extends RepoInterface<PPEToolModel> {
  private static instance: EditPPEToolRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditPPEToolRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): PPEToolModel {
    return PPEToolModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditPPEToolApiService.getInstance()
  }
}

export { EditPPEToolRepo }
