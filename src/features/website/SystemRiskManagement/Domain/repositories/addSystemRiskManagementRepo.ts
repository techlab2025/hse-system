// import LangModel from '@/features/setting/SystemRiskManagement/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { AddSystemRiskManagementApiService } from '../../Data/apiServices/addSystemRiskManagementApiService'


class AddSystemRiskManagementRepo extends RepoInterface<SystemRiskManagementModel> {
  private static instance: AddSystemRiskManagementRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemRiskManagementRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SystemRiskManagementModel {
    return SystemRiskManagementModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSystemRiskManagementApiService.getInstance()
  }
}

export { AddSystemRiskManagementRepo }
