import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexMeetingTypeApiService } from '../../Data/apiServices/indexMeetingTypeApiService'
import MeetingTypeModel from '../../Data/models/MeetingTypeModel'

class IndexMeetingTypeRepo extends RepoInterface<MeetingTypeModel[]> {
  private static instance: IndexMeetingTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexMeetingTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): MeetingTypeModel[] {
    return data.map((item: any) => MeetingTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexMeetingTypeApiService.getInstance()
  }
}

export { IndexMeetingTypeRepo }
