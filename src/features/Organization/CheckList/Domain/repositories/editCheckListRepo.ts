import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditCheckListApiService } from '../../Data/apiServices/editCheckListApiService'
import CheckListDetailsModel from '../../Data/models/CheckListModel'


class EditCheckListRepo extends RepoInterface<CheckListDetailsModel> {
  private static instance: EditCheckListRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditCheckListRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): CheckListDetailsModel {
    return CheckListDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditCheckListApiService.getInstance()
  }
}

export { EditCheckListRepo }
