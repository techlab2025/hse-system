// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectModel from '../../../Data/models/ProjectModel'
import { PermitToWorkApiService } from '../../../Data/apiServices/PermitToWork/PermitToWorkApiService'
import PermitStaticsModel from '../../../Data/models/PermitToWork/PermitStaticsModel'
import { FetchStaticsMyPermitsApiService } from '../../../Data/apiServices/PermitToWork/FetchStaticsMyPermitsApiService'

class PermitStaticsToWorkRepo extends RepoInterface<PermitStaticsModel> {
  private static instance: PermitStaticsToWorkRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new PermitStaticsToWorkRepo()
    }
    return this.instance
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData
  // }

  onParse(data: any): PermitStaticsModel {
    return PermitStaticsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchStaticsMyPermitsApiService.getInstance()
  }
}

export { PermitStaticsToWorkRepo }
