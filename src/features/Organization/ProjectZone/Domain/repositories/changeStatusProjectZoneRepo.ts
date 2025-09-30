// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { ChangeStatusProjectZoneApiService } from '../../Data/apiServices/changeStatusProjectZoneApiService'



class ChangeStatusProjectZoneRepo extends RepoInterface<ProjectZoneModel> {
  private static instance: ChangeStatusProjectZoneRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusProjectZoneRepo()
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
    return ChangeStatusProjectZoneApiService.getInstance()
  }
}

export { ChangeStatusProjectZoneRepo }
