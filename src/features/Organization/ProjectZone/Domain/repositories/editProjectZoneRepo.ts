// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { EditProjectZoneApiService } from '../../Data/apiServices/editProjectZoneApiService'




class EditProjectZoneRepo extends RepoInterface<ProjectZoneModel> {
  private static instance: EditProjectZoneRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditProjectZoneRepo()
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
    return EditProjectZoneApiService.getInstance()
  }
}

export { EditProjectZoneRepo }
