// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HerikalyModel from '../../Data/models/HerikalyModel'
import { EditHerikalyApiService } from '../../Data/apiServices/editHerikalyApiService'




class EditHerikalyRepo extends RepoInterface<HerikalyModel> {
  private static instance: EditHerikalyRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHerikalyRepo()
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
    return EditHerikalyApiService.getInstance()
  }
}

export { EditHerikalyRepo }
