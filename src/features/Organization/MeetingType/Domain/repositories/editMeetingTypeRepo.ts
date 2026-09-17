import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import { EditMeetingTypeApiService } from '../../Data/apiServices/editMeetingTypeApiService'


class EditMeetingTypeRepo extends RepoInterface<MeetingTypeModel> {
  private static instance: EditMeetingTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditMeetingTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): MeetingTypeModel {
    return MeetingTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditMeetingTypeApiService.getInstance()
  }
}

export { EditMeetingTypeRepo }
