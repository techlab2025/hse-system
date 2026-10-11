import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexDocumentCategoryApiService } from '../../Data/apiServices/indexDocumentCategoryApiService'
import DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'

class IndexDocumentCategoryRepo extends RepoInterface<DocumentCategoryModel[]> {
  private static instance: IndexDocumentCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexDocumentCategoryRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): DocumentCategoryModel[] {
    return data.map((item: any) => DocumentCategoryModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexDocumentCategoryApiService.getInstance()
  }
}

export { IndexDocumentCategoryRepo }
