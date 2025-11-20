import { DisHealthConditionsApiService } from '@/features/setting/HealthConditions/Data/apiServices/disHealthConditionsApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

class DisActiveHealthConditionsRepo extends RepoInterface<HealthConditionsModel> {
  private static instance: DisActiveHealthConditionsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveHealthConditionsRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HealthConditionsModel {
    return HealthConditionsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisHealthConditionsApiService.getInstance()
  }
}

export { DisActiveHealthConditionsRepo }
