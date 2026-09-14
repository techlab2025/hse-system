import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MeetingTypeDetailsModel from '../../Data/models/MeetingTypeDetailsModel'
import { ShowMeetingTypeApiService } from '../../Data/apiServices/showMeetingTypeApiService'

class ShowMeetingTypeRepo extends RepoInterface<MeetingTypeDetailsModel> {
  private static instance: ShowMeetingTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowMeetingTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): MeetingTypeDetailsModel {
    return MeetingTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowMeetingTypeApiService.getInstance()
  }
}

export { ShowMeetingTypeRepo }
