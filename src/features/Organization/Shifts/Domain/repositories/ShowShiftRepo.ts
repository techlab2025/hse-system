import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ShiftDetailsModel from '../../Data/models/ShiftDetailsModel'
import { ShowShiftApiService } from '../../Data/apiServices/ShowShiftApiService'

class ShowShiftRepo extends RepoInterface<ShiftDetailsModel> {
  private static instance: ShowShiftRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowShiftRepo()
    }
    return this.instance
  }

  onParse(data: any): ShiftDetailsModel {
    return ShiftDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowShiftApiService.getInstance()
  }
}

export { ShowShiftRepo }
