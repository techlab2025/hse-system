import { DeleteEquipmentTypeApiService } from '@/features/setting/EquipmentType/Data/apiServices/deleteEquipmentTypeApiService'
// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'

class DeleteEquipmentTypeRepo extends RepoInterface<EquipmentTypeModel> {
  private static instance: DeleteEquipmentTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEquipmentTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): EquipmentTypeModel {
    return EquipmentTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteEquipmentTypeApiService.getInstance()
  }
}

export { DeleteEquipmentTypeRepo }
