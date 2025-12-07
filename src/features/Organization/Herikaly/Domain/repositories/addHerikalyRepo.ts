// import LangModel from '@/features/setting/Herikaly/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HerikalyModel from '../../Data/models/HerikalyModel'
import { AddHerikalyApiService } from '../../Data/apiServices/addHerikalyApiService'

class AddHerikalyRepo extends RepoInterface<HerikalyModel> {
  private static instance: AddHerikalyRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHerikalyRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HerikalyModel {
    return HerikalyModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddHerikalyApiService.getInstance()
  }
}

export { AddHerikalyRepo }
