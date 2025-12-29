import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddMeetingsApiService } from '../../../Data/apiServices/Meetings/addMeetingsApiService'
import MeetingModel from '../../../Data/models/Meetings/MeetingModel'

class AddMeetingRepo extends RepoInterface<MeetingModel> {
  private static instance: AddMeetingRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMeetingRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): MeetingModel {
    return MeetingModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddMeetingsApiService.getInstance()
  }
}

export { AddMeetingRepo }
