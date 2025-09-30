// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HerikalyModel from '../../Data/models/HerikalyModel'
import { DeleteHerikalyApiService } from '../../Data/apiServices/deleteHerikalyApiService'



// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteHerikalyRepo extends RepoInterface<HerikalyModel> {
  private static instance: DeleteHerikalyRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHerikalyRepo()
    }
    return this.instance
  }

  onParse(data: any): HerikalyModel {
    return HerikalyModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHerikalyApiService.getInstance()
  }
}

export { DeleteHerikalyRepo }
