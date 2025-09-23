// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import { DisActiveFactoryItemApiService } from '@/features/setting/FactoryItem/Data/apiServices/disActiveFactoryItemApiService.ts'

class DisActiveFactoryItemRepo extends RepoInterface<FactoryItemModel> {
  private static instance: DisActiveFactoryItemRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveFactoryItemRepo()
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
    return DisActiveFactoryItemApiService.getInstance()
  }
}

export { DisActiveFactoryItemRepo }
