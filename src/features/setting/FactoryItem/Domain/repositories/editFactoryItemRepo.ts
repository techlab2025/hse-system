// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import { EditFactoryItemApiService } from '@/features/setting/FactoryItem/Data/apiServices/editFactoryItemApiService.ts'

class EditFactoryItemRepo extends RepoInterface<FactoryItemModel> {
  private static instance: EditFactoryItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditFactoryItemRepo()
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
    return EditFactoryItemApiService.getInstance()
  }
}

export { EditFactoryItemRepo }
