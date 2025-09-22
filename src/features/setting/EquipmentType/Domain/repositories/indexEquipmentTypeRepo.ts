// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexEquipmentTypeApiService } from '@/features/setting/EquipmentType/Data/apiServices/indexEquipmentTypeApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'

class IndexEquipmentTypeRepo extends RepoInterface<EquipmentTypeModel[]> {
  private static instance: IndexEquipmentTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEquipmentTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): EquipmentTypeModel[] {
    return data.map((item: any) => EquipmentTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexEquipmentTypeApiService.getInstance()
  }
}

export { IndexEquipmentTypeRepo }
