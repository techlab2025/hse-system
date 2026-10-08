import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowDocumentCategoryApiService } from '../../Data/apiServices/showDocumentCategoryApiService'
import DocumentCategoryDetailsModel from '../../Data/models/DocumentCategoryDetailsModel'

class ShowDocumentCategoryRepo extends RepoInterface<DocumentCategoryDetailsModel> {
  private static instance: ShowDocumentCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowDocumentCategoryRepo()
    }
    return this.instance
  }

  onParse(data: any): DocumentCategoryDetailsModel {
    return DocumentCategoryDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowDocumentCategoryApiService.getInstance()
  }
}

export { ShowDocumentCategoryRepo }
