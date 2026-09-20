import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchProjectMeetingsApiService from '../../../Data/apiServices/ProjectMeeting/FetchProjectMeetingsApiService'
import ProjectMeetingModel from '../../../Data/models/ProjectMeeting/ProjectMeetingModel'

export default class FetchProjectMeetingsRepo extends RepoInterface<ProjectMeetingModel[]> {
  private static instance: FetchProjectMeetingsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchProjectMeetingsRepo()
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: Array<Record<string, unknown>>): ProjectMeetingModel[] {
    return data.map((item) => ProjectMeetingModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchProjectMeetingsApiService.getInstance()
  }
}
