// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type ProjectZoneDetailsModel from '../../Data/models/ProjectZoneDetailsModel'
import ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { DeleteProjectZoneApiService } from '../../Data/apiServices/deleteProjectZoneApiService'



// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteProjectZoneRepo extends RepoInterface<ProjectZoneDetailsModel> {
  private static instance: DeleteProjectZoneRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectZoneRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectZoneModel {
    return ProjectZoneModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteProjectZoneApiService.getInstance()
  }
}

export { DeleteProjectZoneRepo }
