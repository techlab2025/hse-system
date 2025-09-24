// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateModel from '../../Data/models/TemplateModel'
import { EditTemplateApiService } from '../../Data/apiServices/editTemplateApiService'

class EditTemplateRepo extends RepoInterface<TemplateModel> {
  private static instance: EditTemplateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTemplateRepo()
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
    return EditTemplateApiService.getInstance()
  }
}

export { EditTemplateRepo }
