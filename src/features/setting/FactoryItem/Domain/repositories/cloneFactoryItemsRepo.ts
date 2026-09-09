import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryItemModel from '../../Data/models/factoryItemModel'
import { CloneFactoryItemsApiService } from '../../Data/apiServices/cloneFactoryItemsApiService'

class CloneFactoryItemsRepo extends RepoInterface<FactoryItemModel> {
  private static instance: CloneFactoryItemsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CloneFactoryItemsRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): FactoryItemModel {
    return FactoryItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CloneFactoryItemsApiService.getInstance()
  }
}

export { CloneFactoryItemsRepo }
