import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MeetingModel from '../../../Data/models/Meetings/MeetingModel'
import { IndexMeetingApiService } from '../../../Data/apiServices/Meetings/indexMeetingApiService'

class IndexMeetingRepo extends RepoInterface<MeetingModel[]> {
  private static instance: IndexMeetingRepo
   
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexMeetingRepo()
    }
    return this.instance
  }

  onParse(data: any): MeetingModel[] {
    return data?.data?.map((item: any) => MeetingModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexMeetingApiService.getInstance()
  }
}

export { IndexMeetingRepo }
