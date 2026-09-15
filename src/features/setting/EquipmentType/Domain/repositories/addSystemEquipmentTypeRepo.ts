// import LangModel from '@/features/setting/EquipmentType/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'
import { AddSystemEquipmentTypeApiService } from '../../Data/apiServices/addSystemEquipmentTypeApiService'

class AddSystemEquipmentTypeRepo extends RepoInterface<EquipmentTypeModel> {
  private static instance: AddSystemEquipmentTypeRepo
   
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemEquipmentTypeRepo()
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
    return AddSystemEquipmentTypeApiService.getInstance()
  }
}

export { AddSystemEquipmentTypeRepo }
