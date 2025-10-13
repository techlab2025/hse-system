// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateItemModel from '../../Data/models/equipmentModel'
import { EditTemplateItemApiService } from '../../Data/apiServices/editTemplateItemApiService'

class EditTemplateItemRepo extends RepoInterface<TemplateItemModel> {
  private static instance: EditTemplateItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTemplateItemRepo()
    }
    return this.instance
  }

  onParse(data: any): TemplateItemModel {
    return TemplateItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditTemplateItemApiService.getInstance()
  }
}

export { EditTemplateItemRepo }
