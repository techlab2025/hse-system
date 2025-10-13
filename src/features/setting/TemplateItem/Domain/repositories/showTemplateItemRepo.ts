import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import TemplateItemDetailsModel from '../../Data/models/equipmentDetailsModel'
import { ShowTemplateItemApiService } from '../../Data/apiServices/showTemplateItemApiService'

class ShowTemplateItemRepo extends RepoInterface<TemplateItemDetailsModel> {
  private static instance: ShowTemplateItemRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTemplateItemRepo()
    }
    return this.instance
  }

  onParse(data: any): TemplateItemDetailsModel {
    return TemplateItemDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowTemplateItemApiService.getInstance()
  }
}

export { ShowTemplateItemRepo }
