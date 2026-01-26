import { AddEquipmentTypeApiService } from '@/features/setting/EquipmentType/Data/apiServices/addEquipmentTypeApiService'
// import LangModel from '@/features/setting/EquipmentType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RootCausesDetailsModel from '../../Data/models/RootCausesDetailsModel'
import RootCausesModel from '../../Data/models/RootCausesModel'
import { AddRootCausesApiService } from '../../Data/apiServices/addRootCausesApiService'

class AddRootCausesRepo extends RepoInterface<RootCausesModel> {
  private static instance: AddRootCausesRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddRootCausesRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): RootCausesDetailsModel {
    return RootCausesDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddRootCausesApiService.getInstance()
  }
}

export { AddRootCausesRepo }
