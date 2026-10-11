// import LangModel from '@/features/setting/DocumentCategory/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddDocumentCategoryApiService } from '../../Data/apiServices/addDocumentCategoryApiService'
import DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'

class AddDocumentCategoryRepo extends RepoInterface<DocumentCategoryModel> {
  private static instance: AddDocumentCategoryRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDocumentCategoryRepo()
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
    return AddDocumentCategoryApiService.getInstance()
  }
}

export { AddDocumentCategoryRepo }
