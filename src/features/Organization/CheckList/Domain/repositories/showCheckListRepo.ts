import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowCheckListApiService } from '../../Data/apiServices/showCheckListApiService'
import CheckListDetailsModel from '../../Data/models/CheckListModel'

class ShowCheckListRepo extends RepoInterface<CheckListDetailsModel> {
  private static instance: ShowCheckListRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCheckListRepo()
    }
    return this.instance
  }

  onParse(data: any): CheckListDetailsModel {
    return CheckListDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowCheckListApiService.getInstance()
  }
}

export { ShowCheckListRepo }
