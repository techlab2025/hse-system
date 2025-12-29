import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MeetingModel from '../../../Data/models/Meetings/MeetingModel'
import { IndexTasksApiService } from '../../../Data/apiServices/Tasks/indexTasksApiService'

class IndexTasksRepo extends RepoInterface<MeetingModel[]> {
  private static instance: IndexTasksRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTasksRepo()
    }
    return this.instance
  }

  onParse(data: any): MeetingModel[] {
    return data?.data?.map((item: any) => MeetingModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexTasksApiService.getInstance()
  }
}

export { IndexTasksRepo }
