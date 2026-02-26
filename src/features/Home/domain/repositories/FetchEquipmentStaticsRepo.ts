import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchEqipmentStaticsApiService } from '../../data/ApiService/FetchEquipmentStaticsApiService'
import EquipmentStaticsModel from '../../data/Model/EquipmentStaticsModel'

class FetchEquipmentStaticsRepo extends RepoInterface<EquipmentStaticsModel> {
  private static instance: FetchEquipmentStaticsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchEquipmentStaticsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): EquipmentStaticsModel {
    return EquipmentStaticsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchEqipmentStaticsApiService.getInstance()
  }
}

export { FetchEquipmentStaticsRepo }
