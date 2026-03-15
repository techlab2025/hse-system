// import LangModel from '@/features/setting/WhereHouseType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CheckListDetailsModel from '../../Data/models/CheckListModel'
import { AddCheckListApiService } from '../../Data/apiServices/AddCheckListApiService'

class AddCheckListRepo extends RepoInterface<CheckListDetailsModel> {
  private static instance: AddCheckListRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddCheckListRepo()
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
    return AddCheckListApiService.getInstance()
  }
}

export { AddCheckListRepo }
