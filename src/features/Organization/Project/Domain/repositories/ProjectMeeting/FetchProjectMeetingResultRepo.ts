// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchMeetingDetailsApiService } from '../../../Data/apiServices/ProjectMeeting/FetchMeetingDetilsApiService'
import ProjectMeetingDetails from '../../../Data/models/ProjectMeeting/ProjectMeetingDetailsModel'

class FetchProjectMeetingResultRepo extends RepoInterface<ProjectMeetingDetails> {
  private static instance: FetchProjectMeetingResultRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectMeetingResultRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectMeetingDetails {
    return ProjectMeetingDetails.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchMeetingDetailsApiService.getInstance()
  }
}

export { FetchProjectMeetingResultRepo }
