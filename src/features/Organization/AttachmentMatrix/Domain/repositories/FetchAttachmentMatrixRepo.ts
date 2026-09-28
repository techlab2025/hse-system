import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchAttachmentMatrixApiService from '../../Data/apiServices/FetchAttachmentMatrixApiService'
import AttachmentMatrixModel from '../../Data/models/AttachmentMatrixModel'

export default class FetchAttachmentMatrixRepo extends RepoInterface<AttachmentMatrixModel> {
  private static instance: FetchAttachmentMatrixRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchAttachmentMatrixRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown>): AttachmentMatrixModel {
    return AttachmentMatrixModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchAttachmentMatrixApiService.getInstance()
  }
}
