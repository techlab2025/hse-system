import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ShiftModel from '../../Data/models/ShiftModel'
import { EditShiftApiService } from '../../Data/apiServices/EditShiftApiService'

class EditShiftRepo extends RepoInterface<ShiftModel> {
  private static instance: EditShiftRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditShiftRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): ShiftModel {
    return ShiftModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditShiftApiService.getInstance()
  }
}

export { EditShiftRepo }
