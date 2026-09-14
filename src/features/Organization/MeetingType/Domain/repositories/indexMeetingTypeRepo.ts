import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import PpeItemModel from '@/features/Organization/ppeItem/Data/models/PpeItemModel'
import { IndexMeetingTypeApiService } from '../../Data/apiServices/indexMeetingTypeApiService'


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
    return data.map((item: any) => PpeItemModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexMeetingTypeApiService.getInstance()
  }
}

export { IndexMeetingTypeRepo }
