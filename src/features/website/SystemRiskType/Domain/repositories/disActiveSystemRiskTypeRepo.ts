// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import { DisSystemRiskTypeApiService } from '../../Data/apiServices/disSystemRiskTypeApiService'

class DisActiveSystemRiskTypeRepo extends RepoInterface<SystemRiskTypeModel> {
  private static instance: DisActiveSystemRiskTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveSystemRiskTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SystemRiskTypeModel {
    return SystemRiskTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisSystemRiskTypeApiService.getInstance()
  }
}

export { DisActiveSystemRiskTypeRepo }
