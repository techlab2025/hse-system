// import LangModel from '@/features/setting/PpeItem/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PpeItemModel from '../../Data/models/PpeItemModel'
import { AddPpeItemClonesApiService } from '../../Data/apiServices/AddPpeItemClonesApiService'

class AddPpeItemCloneRepo extends RepoInterface<PpeItemModel> {
  private static instance: AddPpeItemCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPpeItemCloneRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PpeItemModel {
    return PpeItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddPpeItemClonesApiService.getInstance()
  }
}

export { AddPpeItemCloneRepo }
