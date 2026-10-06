import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'
import { DeleteDocumentCategoryApiService } from '../../Data/apiServices/deleteDocumentCategoryApiService'

class DeleteDocumentCategoryRepo extends RepoInterface<DocumentCategoryModel> {
  private static instance: DeleteDocumentCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteDocumentCategoryRepo()
    }
    return this.instance
  }

  onParse(data: any): DocumentCategoryModel {
    return DocumentCategoryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteDocumentCategoryApiService.getInstance()
  }
}

export { DeleteDocumentCategoryRepo }
