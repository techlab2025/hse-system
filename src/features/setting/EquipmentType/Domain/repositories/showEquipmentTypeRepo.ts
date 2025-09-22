import { ShowEquipmentTypeApiService } from '@/features/setting/EquipmentType/Data/apiServices/showEquipmentTypeApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import EquipmentTypeDetailsModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeDetailsModel.ts'

class ShowEquipmentTypeRepo extends RepoInterface<EquipmentTypeDetailsModel> {
  private static instance: ShowEquipmentTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEquipmentTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): EquipmentTypeDetailsModel {
    return EquipmentTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowEquipmentTypeApiService.getInstance()
  }
}

export { ShowEquipmentTypeRepo }
