// import LangModel from '@/features/setting/MeetingType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import { AddMeetingTypeClonesApiService } from '../../Data/apiServices/AddMeetingTypeClonesApiService'

class AddMeetingTypeCloneRepo extends RepoInterface<MeetingTypeModel> {
  private static instance: AddMeetingTypeCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMeetingTypeCloneRepo()
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
    return AddMeetingTypeClonesApiService.getInstance()
  }
}

export { AddMeetingTypeCloneRepo }
