// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { DeleteSystemRiskManagementApiService } from '../../Data/apiServices/deleteSystemRiskManagementApiService'



// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteSystemRiskManagementRepo extends RepoInterface<SystemRiskManagementModel> {
  private static instance: DeleteSystemRiskManagementRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemRiskManagementRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemRiskManagementModel {
    return SystemRiskManagementModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteSystemRiskManagementApiService.getInstance()
  }
}

export { DeleteSystemRiskManagementRepo }
