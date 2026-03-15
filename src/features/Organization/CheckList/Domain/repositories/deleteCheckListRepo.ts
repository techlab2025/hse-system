import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteCheckListApiService } from '../../Data/apiServices/deleteCheckListApiService'
import CheckListDetailsModel from '../../Data/models/CheckListModel'

class DeleteCheckListRepo extends RepoInterface<CheckListDetailsModel> {
  private static instance: DeleteCheckListRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCheckListRepo()
    }
    return this.instance
  }

  onParse(data: any): CheckListDetailsModel {
    return CheckListDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteCheckListApiService.getInstance()
  }
}

export { DeleteCheckListRepo }
