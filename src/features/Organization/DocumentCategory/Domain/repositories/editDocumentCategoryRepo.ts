import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'
import { EditDocumentCategoryApiService } from '../../Data/apiServices/editDocumentCategoryApiService'

class EditDocumentCategoryRepo extends RepoInterface<DocumentCategoryModel> {
  private static instance: EditDocumentCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditDocumentCategoryRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): DocumentCategoryModel {
    return DocumentCategoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditDocumentCategoryApiService.getInstance()
  }
}

export { EditDocumentCategoryRepo }
