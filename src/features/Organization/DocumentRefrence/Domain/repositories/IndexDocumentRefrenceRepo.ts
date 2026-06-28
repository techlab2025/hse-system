import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import { IndexDocumentRefrenceApiService } from '../../Data/apiServices/IndexDocumentRefrenceApiService'

class IndexDocumentRefrenceRepo extends RepoInterface<DocumentRefrenceModel[]> {
  private static instance: IndexDocumentRefrenceRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexDocumentRefrenceRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): DocumentRefrenceModel[] {
    return data.map((item: any) => DocumentRefrenceModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexDocumentRefrenceApiService.getInstance()
  }
}

export { IndexDocumentRefrenceRepo }
