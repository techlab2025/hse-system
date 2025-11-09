// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import TemplateItemModel from '../../Data/models/TemplateItemModel'
import { DeleteTemplateItemApiService } from '../../Data/apiServices/deleteTemplateItemApiService'

class DeleteTemplateItemRepo extends RepoInterface<TemplateItemModel> {
  private static instance: DeleteTemplateItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTemplateItemRepo()
    }
    return this.instance
  }

  onParse(data: any): TemplateItemModel {
    return TemplateItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteTemplateItemApiService.getInstance()
  }
}

export { DeleteTemplateItemRepo }
