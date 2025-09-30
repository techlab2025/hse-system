// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HerikalyModel from '../../Data/models/HerikalyModel'
import { ChangeStatusHerikalyApiService } from '../../Data/apiServices/changeStatusHerikalyApiService'



class ChangeStatusHerikalyRepo extends RepoInterface<HerikalyModel> {
  private static instance: ChangeStatusHerikalyRepo
  // eslint-ChangeStatusable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusHerikalyRepo()
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
    return ChangeStatusHerikalyApiService.getInstance()
  }
}

export { ChangeStatusHerikalyRepo }
