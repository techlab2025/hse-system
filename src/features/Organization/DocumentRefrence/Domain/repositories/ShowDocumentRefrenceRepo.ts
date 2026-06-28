import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DocumentRefrenceDetailsModel from '../../Data/models/DocumentRefrenceDetailsModel'
import { ShowDocumentRefrenceApiService } from '../../Data/apiServices/ShowDocumentRefrenceApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowDocumentRefrenceRepo extends RepoInterface<DocumentRefrenceDetailsModel> {
  private static instance: ShowDocumentRefrenceRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowDocumentRefrenceRepo()
    }
    return this.instance
  }

  onParse(data: any): DocumentRefrenceDetailsModel {
    return DocumentRefrenceDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowDocumentRefrenceApiService.getInstance()
  }
}

export { ShowDocumentRefrenceRepo }
