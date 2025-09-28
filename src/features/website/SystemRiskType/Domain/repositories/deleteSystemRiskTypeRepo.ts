// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import { DeleteSystemRiskTypeApiService } from '../../Data/apiServices/deleteSystemRiskTypeApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteSystemRiskTypeRepo extends RepoInterface<SystemRiskTypeModel> {
  private static instance: DeleteSystemRiskTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemRiskTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): SystemRiskTypeModel {
    return SystemRiskTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteSystemRiskTypeApiService.getInstance()
  }
}

export { DeleteSystemRiskTypeRepo }
