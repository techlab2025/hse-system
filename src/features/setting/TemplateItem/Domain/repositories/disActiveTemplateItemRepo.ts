// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateItemModel from '../../Data/models/TemplateItemModel'
import { DisTemplateItemApiService } from '../../Data/apiServices/disTemplateItemApiService'

class DisActiveTemplateItemRepo extends RepoInterface<TemplateItemModel> {
  private static instance: DisActiveTemplateItemRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveTemplateItemRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): TemplateItemModel {
    return TemplateItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisTemplateItemApiService.getInstance()
  }
}

export { DisActiveTemplateItemRepo }
