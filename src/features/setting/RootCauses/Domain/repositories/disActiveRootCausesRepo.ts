import { DisEquipmentTypeApiService } from '@/features/setting/EquipmentType/Data/apiServices/disEquipmentTypeApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RootCausesModel from '../../Data/models/RootCausesModel'
import type RootCausesDetailsModel from '../../Data/models/RootCausesDetailsModel'

class DisActiveRootCausesRepo extends RepoInterface<RootCausesModel> {
  private static instance: DisActiveRootCausesRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveRootCausesRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): RootCausesDetailsModel {
    return RootCausesModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisEquipmentTypeApiService.getInstance()
  }
}

export { DisActiveRootCausesRepo }
