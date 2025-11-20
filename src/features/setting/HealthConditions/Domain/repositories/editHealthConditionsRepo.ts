import { EditHealthConditionsApiService } from '@/features/setting/HealthConditions/Data/apiServices/editHealthConditionsApiService.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

class EditHealthConditionsRepo extends RepoInterface<HealthConditionsModel> {
  private static instance: EditHealthConditionsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHealthConditionsRepo()
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
    return EditHealthConditionsApiService.getInstance()
  }
}

export { EditHealthConditionsRepo }
