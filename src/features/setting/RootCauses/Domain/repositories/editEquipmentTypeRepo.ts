import { EditEquipmentTypeApiService } from '@/features/setting/EquipmentType/Data/apiServices/editEquipmentTypeApiService.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'

class EditEquipmentTypeRepo extends RepoInterface<EquipmentTypeModel> {
  private static instance: EditEquipmentTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditEquipmentTypeRepo()
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
    return EditEquipmentTypeApiService.getInstance()
  }
}

export { EditEquipmentTypeRepo }
