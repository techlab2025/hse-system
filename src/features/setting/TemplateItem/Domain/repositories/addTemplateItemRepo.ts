// import LangModel from '@/features/setting/TemplateItemType/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateItemModel from '../../Data/models/equipmentModel'
import { AddTemplateItemApiService } from '../../Data/apiServices/addTemplateItemApiService'

class AddTemplateItemRepo extends RepoInterface<TemplateItemModel> {
  private static instance: AddTemplateItemRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTemplateItemRepo()
    }
    return this.instance
  }

  onParse(data: any): TemplateItemModel {
    return TemplateItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddTemplateItemApiService.getInstance()
  }
}

export { AddTemplateItemRepo }
