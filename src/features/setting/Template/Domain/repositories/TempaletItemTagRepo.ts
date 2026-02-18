import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TemplateDetailsModel from '../../Data/models/TemplateDetailsModel'
import { ShowTemplateApiService } from '../../Data/apiServices/showTemplateApiService'
import TemplateItemTagModel from '../../Data/models/TemplateItemTagModel'
import { TemplateItemTagApiService } from '../../Data/apiServices/TemplateItemTagApiService'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class TemplateItemTagRepo extends RepoInterface<TemplateItemTagModel[]> {
  private static instance: TemplateItemTagRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new TemplateItemTagRepo()
    }
    return this.instance
  }

  onParse(data: any): TemplateItemTagModel[] {
    return data.map((item: any) => TemplateItemTagModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return TemplateItemTagApiService.getInstance()
  }
}

export { TemplateItemTagRepo }
