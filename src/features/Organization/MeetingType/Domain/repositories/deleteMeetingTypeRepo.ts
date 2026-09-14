import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import { DeleteMeetingTypeApiService } from '../../Data/apiServices/deleteMeetingTypeApiService'

class DeleteMeetingTypeRepo extends RepoInterface<MeetingTypeModel> {
  private static instance: DeleteMeetingTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteMeetingTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): MeetingTypeModel {
    return MeetingTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteMeetingTypeApiService.getInstance()
  }
}

export { DeleteMeetingTypeRepo }
