import { AddEquipmentTypeApiService } from '@/features/setting/EquipmentType/Data/apiServices/addEquipmentTypeApiService'
// import LangModel from '@/features/setting/EquipmentType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'

class AddEquipmentTypeRepo extends RepoInterface<EquipmentTypeModel> {
  private static instance: AddEquipmentTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddEquipmentTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): EquipmentTypeModel {
    return EquipmentTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddEquipmentTypeApiService.getInstance()
  }
}

export { AddEquipmentTypeRepo }
