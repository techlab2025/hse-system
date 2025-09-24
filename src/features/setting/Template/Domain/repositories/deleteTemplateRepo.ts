// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateModel from '../../Data/models/TemplateModel'
import { DeleteTemplateApiService } from '../../Data/apiServices/deleteTemplateApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteTemplateRepo extends RepoInterface<TemplateModel> {
  private static instance: DeleteTemplateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTemplateRepo()
    }
    return this.instance
  }

  onParse(data: any): TemplateModel {
    return TemplateModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteTemplateApiService.getInstance()
  }
}

export { DeleteTemplateRepo }
