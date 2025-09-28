// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { EditSystemRiskManagementApiService } from '../../Data/apiServices/editSystemRiskManagementApiService'




class EditSystemRiskManagementRepo extends RepoInterface<SystemRiskManagementModel> {
  private static instance: EditSystemRiskManagementRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditSystemRiskManagementRepo()
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
    return EditSystemRiskManagementApiService.getInstance()
  }
}

export { EditSystemRiskManagementRepo }
