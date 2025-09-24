import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateDetailsModel from '../../Data/models/TemplateDetailsModel'
import { ShowTemplateApiService } from '../../Data/apiServices/showTemplateApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowTemplateRepo extends RepoInterface<TemplateDetailsModel> {
  private static instance: ShowTemplateRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTemplateRepo()
    }
    return this.instance
  }

  onParse(data: any): TemplateDetailsModel {
    return TemplateDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowTemplateApiService.getInstance()
  }
}

export { ShowTemplateRepo }
