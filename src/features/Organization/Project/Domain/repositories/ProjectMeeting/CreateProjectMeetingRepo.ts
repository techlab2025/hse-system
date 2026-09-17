// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CreateProjectMeetingApiService } from '../../../Data/apiServices/ProjectMeeting/CreateProjectMeetingApiService'
import ProjectModel from '../../../Data/models/ProjectModel'

class CreateProjectMeetingRepo extends RepoInterface<ProjectModel> {
  private static instance: CreateProjectMeetingRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateProjectMeetingRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ProjectModel {
    return ProjectModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateProjectMeetingApiService.getInstance()
  }
}

export { CreateProjectMeetingRepo }
