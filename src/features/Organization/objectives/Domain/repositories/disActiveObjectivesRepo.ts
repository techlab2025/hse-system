// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObjectivesModel from '../../Data/models/objectivesModel'
import { DisObjectivesApiService } from '../../Data/apiServices/disObjectivesApiService'

class DisActiveObjectivesRepo extends RepoInterface<ObjectivesModel> {
  private static instance: DisActiveObjectivesRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveObjectivesRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ObjectivesModel {
    return ObjectivesModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisObjectivesApiService.getInstance()
  }
}

export { DisActiveObjectivesRepo }
