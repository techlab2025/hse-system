// import LangModel from '@/features/setting/Injury/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import { AddDocumentRefrenceApiService } from '../../Data/apiServices/AddDocumentRefrenceApiService'

class AddDocumentRefrenceRepo extends RepoInterface<DocumentRefrenceModel> {
  private static instance: AddDocumentRefrenceRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDocumentRefrenceRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): DocumentRefrenceModel {
    return DocumentRefrenceModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddDocumentRefrenceApiService.getInstance()
  }
}

export { AddDocumentRefrenceRepo }
