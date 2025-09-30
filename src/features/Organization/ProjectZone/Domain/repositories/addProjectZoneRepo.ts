// import LangModel from '@/features/setting/ProjectZone/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { AddProjectZoneApiService } from '../../Data/apiServices/addProjectZoneApiService'


class AddProjectZoneRepo extends RepoInterface<ProjectZoneModel> {
  private static instance: AddProjectZoneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddProjectZoneRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ProjectZoneModel {
    return ProjectZoneModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddProjectZoneApiService.getInstance()
  }
}

export { AddProjectZoneRepo }
