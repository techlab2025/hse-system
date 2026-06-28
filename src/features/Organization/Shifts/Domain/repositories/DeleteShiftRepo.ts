import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ShiftModel from '../../Data/models/ShiftModel'
import { DeleteShiftApiService } from '../../Data/apiServices/DeleteShiftApiService'

class DeleteShiftRepo extends RepoInterface<ShiftModel> {
  private static instance: DeleteShiftRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteShiftRepo()
    }
    return this.instance
  }

  onParse(data: any): ShiftModel {
    return ShiftModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteShiftApiService.getInstance()
  }
}

export { DeleteShiftRepo }
