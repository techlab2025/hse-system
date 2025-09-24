// import LangModel from '@/features/setting/Template/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateModel from '../../Data/models/TemplateModel'
import { AddTemplateApiService } from '../../Data/apiServices/addTemplateApiService'

class AddTemplateRepo extends RepoInterface<TemplateModel> {
  private static instance: AddTemplateRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTemplateRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): TemplateModel {
    return TemplateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddTemplateApiService.getInstance()
  }
}

export { AddTemplateRepo }
