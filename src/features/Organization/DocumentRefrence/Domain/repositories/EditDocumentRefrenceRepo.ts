import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import { EditDocumentRefrenceApiService } from '../../Data/apiServices/EditDocumentRefrenceApiService'

class EditDocumentRefrenceRepo extends RepoInterface<DocumentRefrenceModel> {
  private static instance: EditDocumentRefrenceRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditDocumentRefrenceRepo()
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
    return EditDocumentRefrenceApiService.getInstance()
  }
}

export { EditDocumentRefrenceRepo }
