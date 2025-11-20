import { DeleteHealthConditionsApiService } from '@/features/setting/HealthConditions/Data/apiServices/deleteHealthConditionsApiService'
// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

class DeleteHealthConditionsRepo extends RepoInterface<HealthConditionsModel> {
  private static instance: DeleteHealthConditionsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHealthConditionsRepo()
    }
    return this.instance
  }

  onParse(data: any): HealthConditionsModel {
    return HealthConditionsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHealthConditionsApiService.getInstance()
  }
}

export { DeleteHealthConditionsRepo }
