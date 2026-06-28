import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import { DeleteDocumentRefrenceApiService } from '../../Data/apiServices/DeleteDocumentRefrenceApiService'

class DeleteDocumentRefrenceRepo extends RepoInterface<DocumentRefrenceModel> {
  private static instance: DeleteDocumentRefrenceRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteDocumentRefrenceRepo()
    }
    return this.instance
  }

  onParse(data: any): DocumentRefrenceModel {
    return DocumentRefrenceModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteDocumentRefrenceApiService.getInstance()
  }
}

export { DeleteDocumentRefrenceRepo }
